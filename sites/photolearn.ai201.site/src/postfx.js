import * as THREE from "three";

// Hand-rolled post pipeline (no example addons, so no version-API risk):
//   scene -> [depth-of-field, driven by aperture]
//         -> [accumulation blend, driven by shutter speed -> motion trails]
//         -> [exposure + grain + vignette, driven by EV + ISO]

const passVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const dofFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform sampler2D tDepth;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform float focusDistance;
  uniform float focusRange;
  uniform float blurPx;
  uniform vec2 texel;
  varying vec2 vUv;

  float linearDepth(float depth) {
    float z = depth * 2.0 - 1.0;
    return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
  }

  void main() {
    float d = texture2D(tDepth, vUv).x;
    float viewZ = linearDepth(d);
    float coc = clamp(abs(viewZ - focusDistance) / focusRange, 0.0, 1.0);
    float radius = coc * blurPx;

    vec4 sum = texture2D(tDiffuse, vUv);
    float total = 1.0;
    const int TAPS = 12;
    for (int i = 0; i < TAPS; i++) {
      float fi = float(i);
      float a = (fi / float(TAPS)) * 6.28318530718 + coc * 2.4;
      float r = radius * (0.35 + 0.65 * (fi / float(TAPS)));
      vec2 offset = vec2(cos(a), sin(a)) * r * texel;
      sum += texture2D(tDiffuse, vUv + offset);
      total += 1.0;
    }
    gl_FragColor = sum / total;
  }
`;

const blendFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tCurrent;
  uniform sampler2D tPrevious;
  uniform float blendFactor;
  varying vec2 vUv;
  void main() {
    vec4 cur = texture2D(tCurrent, vUv);
    vec4 prev = texture2D(tPrevious, vUv);
    gl_FragColor = mix(prev, cur, blendFactor);
  }
`;

const finalFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform float exposure;
  uniform float grainAmount;
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233)) + time * 37.0) * 43758.5453);
  }

  void main() {
    vec3 color = texture2D(tDiffuse, vUv).rgb * exposure;
    color = color / (color + vec3(0.9));
    color = pow(max(color, 0.0), vec3(0.92));

    float n = (hash(vUv * resolution) - 0.5) * grainAmount;
    color += n;

    vec2 uvC = vUv - 0.5;
    float vig = smoothstep(0.92, 0.3, length(uvC));
    color *= mix(0.62, 1.0, vig);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

function makeQuad(fragmentShader, uniforms) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({ vertexShader: passVertex, fragmentShader, uniforms, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return { scene, camera, mat };
}

export class PostFX {
  constructor(renderer) {
    this.renderer = renderer;
    this.width = 2;
    this.height = 2;

    this.mainRT = null;
    this.dofRT = null;
    this.accum = [null, null];
    this.accumIndex = 0;
    this.accumPrimed = false;

    this.dof = makeQuad(dofFragment, {
      tDiffuse: { value: null },
      tDepth: { value: null },
      cameraNear: { value: 0.1 },
      cameraFar: { value: 100 },
      focusDistance: { value: 5 },
      focusRange: { value: 2 },
      blurPx: { value: 0 },
      texel: { value: new THREE.Vector2() },
    });

    this.blend = makeQuad(blendFragment, {
      tCurrent: { value: null },
      tPrevious: { value: null },
      blendFactor: { value: 1 },
    });

    this.final = makeQuad(finalFragment, {
      tDiffuse: { value: null },
      exposure: { value: 1 },
      grainAmount: { value: 0 },
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() },
    });

    this.setSize(2, 2);
  }

  setSize(w, h) {
    w = Math.max(2, Math.floor(w));
    h = Math.max(2, Math.floor(h));
    if (w === this.width && h === this.height && this.mainRT) return;
    this.width = w;
    this.height = h;

    [this.mainRT, this.dofRT, ...this.accum].forEach((rt) => rt && rt.dispose());

    const depthTexture = new THREE.DepthTexture(w, h);
    depthTexture.type = THREE.UnsignedIntType;
    depthTexture.format = THREE.DepthFormat;

    const rtOpts = { depthBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    this.mainRT = new THREE.WebGLRenderTarget(w, h, { ...rtOpts, depthTexture, depthBuffer: true });
    this.dofRT = new THREE.WebGLRenderTarget(w, h, rtOpts);
    this.accum = [new THREE.WebGLRenderTarget(w, h, rtOpts), new THREE.WebGLRenderTarget(w, h, rtOpts)];
    this.accumPrimed = false;

    this.dof.mat.uniforms.texel.value.set(1 / w, 1 / h);
    this.final.mat.uniforms.resolution.value.set(w, h);
  }

  reset() {
    this.accumPrimed = false;
  }

  render(scene, camera, params) {
    const r = this.renderer;
    const prevTarget = r.getRenderTarget();

    r.setRenderTarget(this.mainRT);
    r.clear();
    r.render(scene, camera);

    const dU = this.dof.mat.uniforms;
    dU.tDiffuse.value = this.mainRT.texture;
    dU.tDepth.value = this.mainRT.depthTexture;
    dU.cameraNear.value = camera.near;
    dU.cameraFar.value = camera.far;
    dU.focusDistance.value = params.focusDistance;
    dU.focusRange.value = params.focusRange;
    dU.blurPx.value = params.blurPx;
    r.setRenderTarget(this.dofRT);
    r.render(this.dof.scene, this.dof.camera);

    const curIdx = this.accumIndex;
    const nextIdx = 1 - this.accumIndex;
    const bU = this.blend.mat.uniforms;
    bU.tCurrent.value = this.dofRT.texture;
    bU.tPrevious.value = this.accum[curIdx].texture;
    bU.blendFactor.value = this.accumPrimed ? params.blendFactor : 1;
    r.setRenderTarget(this.accum[nextIdx]);
    r.render(this.blend.scene, this.blend.camera);
    this.accumIndex = nextIdx;
    this.accumPrimed = true;

    const fU = this.final.mat.uniforms;
    fU.tDiffuse.value = this.accum[nextIdx].texture;
    fU.exposure.value = params.exposure;
    fU.grainAmount.value = params.grainAmount;
    fU.time.value = params.time;

    r.setRenderTarget(prevTarget);
    r.render(this.final.scene, this.final.camera);
  }
}
