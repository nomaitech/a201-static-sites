import * as THREE from "three";
import { APERTURE_STOPS, SHUTTER_STOPS } from "./exposure.js";

const APERTURE_2_8_IDX = APERTURE_STOPS.indexOf(2.8);
const APERTURE_8_IDX = APERTURE_STOPS.indexOf(8);
const SHUTTER_1_8_IDX = SHUTTER_STOPS.indexOf(1 / 8);
const SHUTTER_1_125_IDX = SHUTTER_STOPS.indexOf(1 / 125);

function standard(color, extra) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...extra });
}

function emissive(color, intensity = 1.4) {
  return new THREE.MeshStandardMaterial({ color: 0x111111, emissive: color, emissiveIntensity: intensity, roughness: 0.5 });
}

function addGround(scene, radius, color) {
  const geo = new THREE.CylinderGeometry(radius, radius, 0.4, 28);
  const mesh = new THREE.Mesh(geo, standard(color, { roughness: 0.95 }));
  mesh.position.y = -0.2;
  scene.add(mesh);
  return mesh;
}

function buildRobotBust() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.58, 1.0, 18), standard(0xd97706, { metalness: 0.35, roughness: 0.4 }));
  body.position.y = 0.5;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 22, 18), standard(0xe5e7eb, { metalness: 0.3, roughness: 0.35 }));
  head.position.y = 1.28;
  g.add(head);
  const eyeGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const eyeMat = emissive(0x4cc9f0, 2.2);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.15, 1.32, 0.34);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.15, 1.32, 0.34);
  g.add(eyeL, eyeR);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), standard(0x888888, { metalness: 0.6 }));
  antenna.position.set(0, 1.85, 0);
  g.add(antenna);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), emissive(0xffb703, 2.0));
  tip.position.set(0, 2.05, 0);
  g.add(tip);
  return g;
}

function buildTree(hue) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 8), standard(0x5a3d2b));
  trunk.position.y = 0.45;
  g.add(trunk);
  const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 10), standard(hue, { roughness: 0.85 }));
  foliage.position.y = 1.3;
  g.add(foliage);
  return g;
}

const GREENS = [0x2d6a4f, 0x40916c, 0x1b4332, 0x52796f];
const BOKEH_COLORS = [0xffd166, 0xef476f, 0x06d6a0, 0x4cc9f0, 0xffb703];

// ------------------------------------------------------------------ LEVEL 1

const isoLevel = {
  id: "iso",
  icon: "🔆",
  name: "ISO — Sensor Sensitivity",
  brief: "It's too dark. Raise ISO until the shot is bright enough.",
  tip: "ISO controls how sensitive the sensor is to light. Doubling ISO doubles brightness — but real sensors trade that for visible grain. Watch the image get brighter and noisier together.",
  controls: { iso: true, aperture: false, shutter: false },
  fixedIdx: { apertureIdx: 3, shutterIdx: 6 },
  initialIdx: { isoIdx: 0, apertureIdx: 3, shutterIdx: 6 },
  targetEV: 3.9,
  tolerance: { great: 1.0, ok: 2.5 },
  cameraPos: [0, 1.15, 5.2],
  cameraLookAt: [0, 0.7, -0.5],
  focusDistance: 5.2,
  background: 0x05060a,
  fog: [0x05060a, 4, 15],
  build(scene) {
    scene.add(new THREE.HemisphereLight(0x24314a, 0x050505, 0.55));
    const lamp = new THREE.PointLight(0xffd39b, 400, 14, 2);
    lamp.position.set(1.4, 2.1, 1.2);
    scene.add(lamp);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), emissive(0xffd39b, 2.5));
    bulb.position.copy(lamp.position);
    scene.add(bulb);

    addGround(scene, 6, 0x2a2018);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), standard(0x1a1512, { roughness: 0.95 }));
    wall.position.set(0, 2.8, -2.4);
    scene.add(wall);

    const vase = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.22, 0.9, 16), standard(0x7f5539, { roughness: 0.5 }));
    base.position.y = 0.45;
    vase.add(base);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 0.35, 16), standard(0x7f5539, { roughness: 0.5 }));
    neck.position.y = 1.07;
    vase.add(neck);
    for (let i = 0; i < 3; i++) {
      const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), standard([0xef476f, 0xffd166, 0x06d6a0][i]));
      fruit.position.set(Math.cos(i * 2.1) * 0.28, 0.98, Math.sin(i * 2.1) * 0.28);
      vase.add(fruit);
    }
    vase.position.set(-0.2, 0, -0.3);
    scene.add(vase);

    let t0 = 0;
    return {
      update(t) {
        t0 = t;
        lamp.intensity = 400 + Math.sin(t * 3.1) * 15;
        vase.rotation.y = Math.sin(t * 0.15) * 0.25;
      },
    };
  },
};

// ------------------------------------------------------------------ LEVEL 2

function apertureVariant(kind) {
  if (kind === "isolate") {
    return {
      brief: "Blur the background to isolate your subject (portrait style).",
      tip: "A LOW f-number (like f/1.4) opens the aperture wide: more light in, and a thin slice of sharp focus that melts the background into soft bokeh.",
      requirementLabel: "Background blurred",
      check: (idx) => idx.apertureIdx <= APERTURE_2_8_IDX,
    };
  }
  return {
    brief: "Keep the whole scene sharp, foreground to background (landscape style).",
    tip: "A HIGH f-number (like f/11) closes the aperture down: less light in, but a deep zone of focus keeps everything crisp.",
    requirementLabel: "Everything in focus",
    check: (idx) => idx.apertureIdx >= APERTURE_8_IDX,
  };
}

const apertureLevel = {
  id: "aperture",
  icon: "⭕",
  name: "Aperture — Depth of Field",
  brief: "",
  tip: "",
  controls: { iso: false, aperture: true, shutter: false },
  fixedIdx: { isoIdx: 2, shutterIdx: 7 },
  initialIdx: { isoIdx: 2, apertureIdx: 4, shutterIdx: 7 },
  targetEV: 9.45,
  tolerance: { great: 1.6, ok: 2.6 },
  cameraPos: [0, 1.3, 6],
  cameraLookAt: [0, 0.9, 0],
  focusDistance: 6,
  background: 0x8fd3ff,
  fog: [0x8fd3ff, 10, 26],
  variants: ["isolate", "landscape"],
  pickVariant(kind) {
    return apertureVariant(kind);
  },
  build(scene) {
    scene.add(new THREE.HemisphereLight(0xbfe3ff, 0x3a5a30, 0.7));
    const sun = new THREE.DirectionalLight(0xfff2d6, 1.15);
    sun.position.set(5, 8, 4);
    scene.add(sun);

    addGround(scene, 20, 0x3a6b35);

    const subject = buildRobotBust();
    subject.position.set(0, 0, 0);
    scene.add(subject);

    const trees = [];
    for (let i = 0; i < 12; i++) {
      const tree = buildTree(GREENS[i % GREENS.length]);
      const z = -6 - Math.random() * 12;
      const x = (Math.random() - 0.5) * 12;
      tree.position.set(x, 0, z);
      const s = 0.7 + Math.random() * 0.8;
      tree.scale.setScalar(s);
      scene.add(tree);
      trees.push(tree);
    }

    const lights = [];
    for (let i = 0; i < 7; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), emissive(BOKEH_COLORS[i % BOKEH_COLORS.length], 2.2));
      const z = -7 - Math.random() * 14;
      const x = (Math.random() - 0.5) * 14;
      s.position.set(x, 1.2 + Math.random() * 2, z);
      scene.add(s);
      lights.push(s);
    }

    return {
      update(t) {
        subject.rotation.y = Math.sin(t * 0.2) * 0.15;
        lights.forEach((l, i) => (l.position.y += Math.sin(t * 1.5 + i) * 0.0015));
      },
    };
  },
};

// ------------------------------------------------------------------ LEVEL 3

function shutterVariant(kind) {
  if (kind === "freeze") {
    return {
      brief: "Freeze the lights sharply — no streaks.",
      tip: "A FAST shutter (like 1/250s) exposes for a tiny sliver of time, so a moving light barely moves during the shot: a crisp, frozen point.",
      requirementLabel: "Motion frozen",
      check: (idx) => idx.shutterIdx >= SHUTTER_1_125_IDX,
    };
  }
  return {
    brief: "Paint the scene with flowing light trails.",
    tip: "A SLOW shutter (like 1/8s or slower) keeps collecting light while things move, stretching bright points into streaks — how car light-trail photos are made.",
    requirementLabel: "Light trails captured",
    check: (idx) => idx.shutterIdx <= SHUTTER_1_8_IDX,
  };
}

function orbitPosition(t, speed, radiusX, radiusZ, centerX, centerZ, y, phase = 0) {
  const a = t * speed + phase;
  return new THREE.Vector3(centerX + Math.cos(a) * radiusX, y, centerZ + Math.sin(a) * radiusZ);
}

const shutterLevel = {
  id: "shutter",
  icon: "⏱️",
  name: "Shutter Speed — Motion",
  brief: "",
  tip: "",
  controls: { iso: false, aperture: false, shutter: true },
  fixedIdx: { isoIdx: 4, apertureIdx: 4 },
  initialIdx: { isoIdx: 4, apertureIdx: 4, shutterIdx: 5 },
  targetEV: 5.95,
  tolerance: { great: 2.1, ok: 3.2 },
  cameraPos: [0, 1.6, 7],
  cameraLookAt: [0, 0.9, -8],
  focusDistance: 17,
  background: 0x03040a,
  fog: [0x03040a, 6, 24],
  variants: ["freeze", "trail"],
  pickVariant(kind) {
    return shutterVariant(kind);
  },
  build(scene) {
    scene.add(new THREE.HemisphereLight(0x1a2a4a, 0x020204, 0.28));

    addGround(scene, 24, 0x0c0e14);

    for (let i = 0; i < 8; i++) {
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2 + Math.random() * 4, 1.6), standard(0x11141c, { roughness: 0.9 }));
      bldg.position.set((Math.random() - 0.5) * 20, bldg.geometry.parameters.height / 2, -10 - Math.random() * 8);
      scene.add(bldg);
      for (let w = 0; w < 4; w++) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.3), emissive(0xffe08a, 1.6));
        win.position.set(bldg.position.x + (Math.random() - 0.5) * 1.2, 0.6 + Math.random() * (bldg.geometry.parameters.height - 1), bldg.position.z + 0.81);
        scene.add(win);
      }
    }

    const movers = [];
    const specs = [
      { color: 0xff5a5f, speed: 1.6, rx: 5.5, rz: 2.4, cx: 0, cz: -12, y: 0.5, phase: 0 },
      { color: 0xffd166, speed: 1.9, rx: 4.0, rz: 3.2, cx: -1, cz: -10, y: 0.7, phase: 2.1 },
      { color: 0x4cc9f0, speed: 1.3, rx: 6.5, rz: 1.8, cx: 1, cz: -13, y: 0.9, phase: 4.2 },
    ];
    specs.forEach((s) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), emissive(s.color, 2.6));
      scene.add(mesh);
      movers.push({ mesh, s });
    });

    return {
      update(t) {
        movers.forEach(({ mesh, s }) => {
          mesh.position.copy(orbitPosition(t, s.speed, s.rx, s.rz, s.cx, s.cz, s.y, s.phase));
        });
      },
    };
  },
};

// ------------------------------------------------------------------ LEVEL 4

const combinedLevel = {
  id: "combined",
  icon: "🎯",
  name: "Full Manual — The Triangle",
  brief: "Dusk street shot: freeze the cyclist's lamp, blur the background, and nail the exposure.",
  tip: "All three controls fight for the same light. A fast shutter and a wide aperture both starve the sensor of light in dim conditions — raise ISO to make up the difference.",
  controls: { iso: true, aperture: true, shutter: true },
  fixedIdx: {},
  initialIdx: { isoIdx: 3, apertureIdx: 4, shutterIdx: 5 },
  targetEV: 5.9,
  tolerance: { great: 0.5, ok: 1.5 },
  cameraPos: [0, 1.3, 6],
  cameraLookAt: [0, 0.9, 0],
  focusDistance: 6,
  background: 0x2b2140,
  fog: [0x2b2140, 8, 24],
  requirementLabels: { dof: "Background blurred", motion: "Lamp frozen" },
  check(idx) {
    return {
      dof: idx.apertureIdx <= APERTURE_2_8_IDX,
      motion: idx.shutterIdx >= SHUTTER_1_125_IDX,
    };
  },
  build(scene) {
    scene.add(new THREE.HemisphereLight(0x4b3a6b, 0x140f24, 0.5));
    const dusk = new THREE.DirectionalLight(0xffb37a, 0.5);
    dusk.position.set(-4, 5, 3);
    scene.add(dusk);

    addGround(scene, 20, 0x241c2e);

    const subject = buildRobotBust();
    scene.add(subject);

    const trees = [];
    for (let i = 0; i < 10; i++) {
      const tree = buildTree(0x22314a);
      const z = -8 - Math.random() * 12;
      const x = (Math.random() - 0.5) * 14;
      tree.position.set(x, 0, z);
      scene.add(tree);
      trees.push(tree);
    }
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), emissive(BOKEH_COLORS[i % BOKEH_COLORS.length], 2.0));
      s.position.set((Math.random() - 0.5) * 14, 1 + Math.random() * 2, -8 - Math.random() * 12);
      scene.add(s);
    }

    const cyclist = new THREE.Group();
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), emissive(0xffe08a, 2.8));
    cyclist.add(lamp);
    scene.add(cyclist);

    return {
      update(t) {
        subject.rotation.y = Math.sin(t * 0.2) * 0.1;
        const x = ((t * 2.6) % 10) - 5;
        cyclist.position.set(x, 0.55, -3.2 + Math.sin(t * 0.7) * 0.6);
      },
    };
  },
};

export const LEVELS = [isoLevel, apertureLevel, shutterLevel, combinedLevel];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}
