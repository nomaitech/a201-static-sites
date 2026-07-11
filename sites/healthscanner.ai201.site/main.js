import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const UP = new THREE.Vector3(0, 1, 0);
const AMBER = 0xe2a253;
const TEAL = 0x74b0a3;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================== Region data ============================== */

const REGIONS = [
  { id: "scalp",     name: "Scalp &amp; Hair",     reco: "A trim and scalp treatment to keep growth on track.", tag: "Grooming" },
  { id: "face",      name: "Face",                 reco: "Book a dermatologist check-in for your skincare routine.", tag: "Skincare" },
  { id: "shoulders", name: "Neck &amp; Shoulders", reco: "Deep-tissue massage to release the desk-job tension.", tag: "Recovery" },
  { id: "chest",     name: "Chest",                reco: "Steady-state cardio, three sessions a week.", tag: "Cardio" },
  { id: "arms",      name: "Arms",                 reco: "Progressive resistance training, twice a week.", tag: "Strength" },
  { id: "core",      name: "Core",                 reco: "A core circuit plus a tighter nutrition plan.", tag: "Nutrition" },
  { id: "hands",     name: "Hands",                reco: "A proper manicure — cuticles included.", tag: "Grooming" },
  { id: "legs",      name: "Legs",                 reco: "A running programme, building from a 5K.", tag: "Cardio" },
  { id: "feet",      name: "Feet",                 reco: "Pedicure. It's overdue.", tag: "Grooming" },
];

/* ============================== Body rig ============================== */

function makeProfile(H, o) {
  return {
    H,
    shoulderX: o.shoulderXF * H,
    hipSocketX: o.hipSocketXF * H,
    chestDepth: o.chestDepthF * H,
    armR: o.armRF * H,
    legR: o.legRF * H,
    headR: o.headRF * H,
    torsoTopR: o.torsoTopRF * H,
    torsoBottomR: o.torsoBottomRF * H,
  };
}

const PROFILES = {
  female: makeProfile(1.70, {
    shoulderXF: 0.145, hipSocketXF: 0.095, chestDepthF: 0.092,
    armRF: 0.030, legRF: 0.048, headRF: 0.058,
    torsoTopRF: 0.085, torsoBottomRF: 0.108,
  }),
  male: makeProfile(1.86, {
    shoulderXF: 0.190, hipSocketXF: 0.088, chestDepthF: 0.108,
    armRF: 0.040, legRF: 0.058, headRF: 0.063,
    torsoTopRF: 0.118, torsoBottomRF: 0.096,
  }),
};

function capsuleSpec(p1, p2, radius) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = Math.max(dir.length() - radius * 1.15, 0.02);
  const geo = new THREE.CapsuleGeometry(radius, len, 4, 8);
  const pos = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  return { geo, pos, quat };
}

function addPart(group, materials, spec) {
  const solidMesh = new THREE.Mesh(spec.geo, materials.solid);
  solidMesh.position.copy(spec.pos);
  if (spec.quat) solidMesh.quaternion.copy(spec.quat);
  const wireMesh = new THREE.Mesh(spec.geo, materials.wire);
  wireMesh.position.copy(spec.pos);
  if (spec.quat) wireMesh.quaternion.copy(spec.quat);
  group.add(solidMesh, wireMesh);
}

function makeMaterials() {
  return {
    solid: new THREE.MeshStandardMaterial({
      color: 0xaebdd6,
      transparent: true,
      opacity: 0,
      roughness: 0.45,
      metalness: 0.06,
      side: THREE.FrontSide,
      emissive: new THREE.Color(0x0c1018),
      emissiveIntensity: 0.7,
    }),
    wire: new THREE.MeshBasicMaterial({
      color: AMBER,
      wireframe: true,
      transparent: true,
      opacity: 0,
    }),
  };
}

function buildFigure(profile) {
  const { H, shoulderX, hipSocketX, chestDepth, armR, legR, headR, torsoTopR, torsoBottomR } = profile;
  const materials = makeMaterials();
  const group = new THREE.Group();
  const y = (f) => f * H;

  const P = {
    hip:        new THREE.Vector3(0, y(0.500), 0),
    waist:      new THREE.Vector3(0, y(0.565), chestDepth * 0.55),
    chest:      new THREE.Vector3(0, y(0.695), chestDepth * 0.62),
    neckBase:   new THREE.Vector3(0, y(0.835), 0),
    chin:       new THREE.Vector3(0, y(0.875), 0),
    headCenter: new THREE.Vector3(0, y(0.935), 0),
    headTop:    new THREE.Vector3(0, y(1.000), 0),
    face:       new THREE.Vector3(0, y(0.900), headR * 0.92),

    shoulderR: new THREE.Vector3(shoulderX, y(0.800), 0),
    shoulderL: new THREE.Vector3(-shoulderX, y(0.800), 0),
    elbowR:    new THREE.Vector3(shoulderX + armR * 0.3, y(0.645), armR * 0.6),
    elbowL:    new THREE.Vector3(-(shoulderX + armR * 0.3), y(0.645), armR * 0.6),
    wristR:    new THREE.Vector3(shoulderX + armR * 0.4, y(0.490), armR * 0.3),
    wristL:    new THREE.Vector3(-(shoulderX + armR * 0.4), y(0.490), armR * 0.3),
    handR:     new THREE.Vector3(shoulderX + armR * 0.4, y(0.415), armR * 0.3),
    handL:     new THREE.Vector3(-(shoulderX + armR * 0.4), y(0.415), armR * 0.3),

    hipSocketR: new THREE.Vector3(hipSocketX, y(0.500), 0),
    hipSocketL: new THREE.Vector3(-hipSocketX, y(0.500), 0),
    kneeR:      new THREE.Vector3(hipSocketX, y(0.285), 0.01 * H),
    kneeL:      new THREE.Vector3(-hipSocketX, y(0.285), 0.01 * H),
    ankleR:     new THREE.Vector3(hipSocketX, y(0.055), 0),
    ankleL:     new THREE.Vector3(-hipSocketX, y(0.055), 0),
    footR:      new THREE.Vector3(hipSocketX, y(0.020), 0.06 * H),
    footL:      new THREE.Vector3(-hipSocketX, y(0.020), 0.06 * H),
  };

  // torso — capped cylinder; pelvis + chest spheres overlap the seams to round them off
  addPart(group, materials, {
    geo: new THREE.CylinderGeometry(torsoTopR, torsoBottomR, P.shoulderR.y - P.hip.y, 16, 3, false),
    pos: new THREE.Vector3(0, (P.hip.y + P.shoulderR.y) / 2, 0),
  });
  // pelvis
  addPart(group, materials, { geo: new THREE.SphereGeometry(torsoBottomR * 1.2, 14, 10), pos: P.hip });
  // chest cap
  addPart(group, materials, {
    geo: new THREE.SphereGeometry(torsoTopR * 1.2, 14, 10),
    pos: new THREE.Vector3(0, P.shoulderR.y, 0),
  });
  // neck + head
  addPart(group, materials, capsuleSpec(P.neckBase, P.chin, headR * 0.42));
  addPart(group, materials, { geo: new THREE.SphereGeometry(headR, 20, 16), pos: P.headCenter });
  // shoulder joints + arms + hands
  for (const side of ["R", "L"]) {
    addPart(group, materials, { geo: new THREE.SphereGeometry(armR * 1.15, 10, 8), pos: P[`shoulder${side}`] });
    addPart(group, materials, capsuleSpec(P[`shoulder${side}`], P[`elbow${side}`], armR));
    addPart(group, materials, capsuleSpec(P[`elbow${side}`], P[`wrist${side}`], armR * 0.85));
    addPart(group, materials, { geo: new THREE.SphereGeometry(armR * 0.95, 10, 8), pos: P[`hand${side}`] });
    // hip socket + legs + feet
    addPart(group, materials, { geo: new THREE.SphereGeometry(legR * 1.1, 10, 8), pos: P[`hipSocket${side}`] });
    addPart(group, materials, capsuleSpec(P[`hipSocket${side}`], P[`knee${side}`], legR));
    addPart(group, materials, capsuleSpec(P[`knee${side}`], P[`ankle${side}`], legR * 0.8));
    addPart(group, materials, { geo: new THREE.SphereGeometry(legR * 0.85, 10, 8), pos: P[`foot${side}`] });
  }

  const hotspotPoints = {
    scalp: P.headTop.clone(),
    face: P.face.clone(),
    shoulders: P.neckBase.clone().lerp(P.shoulderR, 0.6),
    chest: P.chest.clone(),
    arms: P.elbowR.clone(),
    core: P.waist.clone(),
    hands: P.handR.clone(),
    legs: P.kneeR.clone(),
    feet: P.footR.clone(),
  };

  const hotspots = new Map();
  for (const [id, pos] of Object.entries(hotspotPoints)) {
    const anchor = new THREE.Object3D();
    anchor.position.copy(pos);
    group.add(anchor);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.014 * H, 10, 8),
      new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0 })
    );
    anchor.add(dot);

    const hitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05 * H, 8, 6),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    anchor.add(hitMesh);

    dot.userData.pulse = 0;
    hotspots.set(id, { anchor, dot, hitMesh });
  }

  return { group, materials, hotspots };
}

/* ============================== Scene setup ============================== */

const viewportPanel = document.querySelector(".viewport-panel");
const canvasEl = document.getElementById("scene");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
camera.position.set(0.15, 1.15, 3.05);

const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.88, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.9;
controls.maxDistance = 4.4;
controls.minPolarAngle = 0.2;
controls.maxPolarAngle = Math.PI * 0.86;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.6;
controls.enablePan = false;

let idleTimer = null;
controls.addEventListener("start", () => {
  controls.autoRotate = false;
  clearTimeout(idleTimer);
});
controls.addEventListener("end", () => {
  if (reduceMotion) return;
  idleTimer = setTimeout(() => { controls.autoRotate = true; }, 3500);
});

scene.add(new THREE.HemisphereLight(0x3b4560, 0x0a0b10, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(1.4, 2.6, 2.0);
scene.add(key);
const rim = new THREE.DirectionalLight(TEAL, 0.55);
rim.position.set(-1.6, 1.2, -2.0);
scene.add(rim);

const platform = new THREE.Mesh(
  new THREE.CircleGeometry(0.85, 48),
  new THREE.MeshBasicMaterial({ color: 0x181d29, transparent: true, opacity: 0.55 })
);
platform.rotation.x = -Math.PI / 2;
platform.position.y = 0.001;
scene.add(platform);

const platformRing = new THREE.Mesh(
  new THREE.RingGeometry(0.83, 0.852, 64),
  new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
);
platformRing.rotation.x = -Math.PI / 2;
platformRing.position.y = 0.002;
scene.add(platformRing);

const sweepDisc = new THREE.Mesh(
  new THREE.RingGeometry(0.37, 0.40, 48),
  new THREE.MeshBasicMaterial({
    color: AMBER, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
  })
);
sweepDisc.rotation.x = -Math.PI / 2;
scene.add(sweepDisc);

const sweepLight = new THREE.PointLight(AMBER, 2.4, 1.5, 2);
scene.add(sweepLight);

const figures = {
  female: buildFigure(PROFILES.female),
  male: buildFigure(PROFILES.male),
};
scene.add(figures.female.group, figures.male.group);

function applyVisibility(figure, v) {
  figure.materials.solid.opacity = 0.46 * v;
  figure.materials.wire.opacity = 0.20 * v;
  figure.group.scale.setScalar(0.92 + 0.08 * v);
  figure.group.visible = v > 0.01;
  for (const { dot } of figure.hotspots.values()) {
    dot.material.opacity = 0.9 * v;
  }
}

function resize() {
  const w = viewportPanel.clientWidth;
  const h = viewportPanel.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
new ResizeObserver(resize).observe(viewportPanel);
resize();

/* ============================== Gender toggle ============================== */

const genderToggle = document.querySelector(".gender-toggle");
const btnFemale = document.getElementById("btnFemale");
const btnMale = document.getElementById("btnMale");
let activeGender = "female";
let genderT = 0; // 0 = female .. 1 = male

function setGender(g) {
  if (g === activeGender) return;
  activeGender = g;
  genderToggle.dataset.active = g;
  btnFemale.classList.toggle("is-active", g === "female");
  btnFemale.setAttribute("aria-checked", String(g === "female"));
  btnMale.classList.toggle("is-active", g === "male");
  btnMale.setAttribute("aria-checked", String(g === "male"));
}
btnFemale.addEventListener("click", () => setGender("female"));
btnMale.addEventListener("click", () => setGender("male"));

/* ============================== Report list ============================== */

const reportList = document.getElementById("reportList");
const rows = new Map();

REGIONS.forEach((region, i) => {
  const li = document.createElement("li");
  li.className = "report-row";
  li.dataset.id = region.id;
  li.tabIndex = 0;
  li.setAttribute("role", "button");
  li.setAttribute("aria-pressed", "false");
  li.innerHTML = `
    <span class="anchor" aria-hidden="true"></span>
    <span class="index">${String(i + 1).padStart(2, "0")}</span>
    <span class="body">
      <p class="region">${region.name}</p>
      <p class="reco">${region.reco}</p>
      <span class="tag">${region.tag}</span>
    </span>
    <span class="pulse" aria-hidden="true"></span>
  `;
  reportList.appendChild(li);
  rows.set(region.id, li);
});

let hoveredId = null;
let selectedId = null;
const activeId = () => hoveredId ?? selectedId;

function refreshActive() {
  const id = activeId();
  rows.forEach((li, rid) => {
    const isActive = rid === id;
    li.classList.toggle("is-active", isActive);
    li.setAttribute("aria-pressed", String(rid === selectedId));
  });
}

function toggleSelection(id) {
  selectedId = selectedId === id ? null : id;
  refreshActive();
}

rows.forEach((li, id) => {
  li.addEventListener("mouseenter", () => { hoveredId = id; refreshActive(); });
  li.addEventListener("mouseleave", () => { hoveredId = null; refreshActive(); });
  li.addEventListener("click", () => toggleSelection(id));
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSelection(id); }
  });
});

/* ============================== 3D pointer picking ============================== */

const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

canvasEl.addEventListener("pointerdown", (e) => {
  const rect = canvasEl.getBoundingClientRect();
  pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  const figure = figures[activeGender];
  const entries = [...figure.hotspots.entries()];
  const hits = raycaster.intersectObjects(entries.map(([, h]) => h.hitMesh), false);
  if (!hits.length) return;

  const hitEntry = entries.find(([, h]) => h.hitMesh === hits[0].object);
  if (!hitEntry) return;
  const [id] = hitEntry;
  toggleSelection(id);
  rows.get(id).scrollIntoView({ behavior: "smooth", block: "nearest" });
});

/* ============================== Leader-line overlay ============================== */

const svgNS = "http://www.w3.org/2000/svg";
const wiresSvg = document.getElementById("wires");
const wireEls = new Map();

REGIONS.forEach((region) => {
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("class", "wire-line");
  const dot = document.createElementNS(svgNS, "circle");
  dot.setAttribute("r", "2.5");
  dot.setAttribute("class", "wire-dot");
  wiresSvg.appendChild(path);
  wiresSvg.appendChild(dot);
  wireEls.set(region.id, { path, dot });
});

const wiresVisible = () => window.matchMedia("(min-width: 901px)").matches;
const tmpVec = new THREE.Vector3();

function updateWires() {
  if (!wiresVisible()) return;
  const figure = figures[activeGender];
  const canvasRect = canvasEl.getBoundingClientRect();
  const id = activeId();

  REGIONS.forEach((region) => {
    const hotspot = figure.hotspots.get(region.id);
    hotspot.anchor.getWorldPosition(tmpVec);
    tmpVec.project(camera);
    const sx = canvasRect.left + (tmpVec.x * 0.5 + 0.5) * canvasRect.width;
    const sy = canvasRect.top + (-tmpVec.y * 0.5 + 0.5) * canvasRect.height;

    const row = rows.get(region.id);
    const anchorEl = row.querySelector(".anchor");
    const targetRect = anchorEl.getBoundingClientRect();
    const tx = targetRect.left + targetRect.width / 2;
    const ty = targetRect.top + targetRect.height / 2;
    const dx = tx - sx;

    const { path, dot } = wireEls.get(region.id);
    path.setAttribute("d", `M ${sx} ${sy} C ${sx + dx * 0.5} ${sy}, ${sx + dx * 0.5} ${ty}, ${tx} ${ty}`);
    dot.setAttribute("cx", sx);
    dot.setAttribute("cy", sy);

    const isActive = id === region.id;
    path.classList.toggle("is-active", isActive);
    dot.classList.toggle("is-active", isActive);
  });
}

/* ============================== Scan sweep ============================== */

const readoutB = document.querySelector("#readoutLine b");
const scannedState = new Map(REGIONS.map((r) => [r.id, false]));
const tmpVec2 = new THREE.Vector3();

function flashRegion(id) {
  const row = rows.get(id);
  row.classList.add("is-scanned");
  clearTimeout(row._scanTimer);
  row._scanTimer = setTimeout(() => row.classList.remove("is-scanned"), 900);

  figures.female.hotspots.get(id).dot.userData.pulse = 1;
  figures.male.hotspots.get(id).dot.userData.pulse = 1;
}

function updateSweep(t) {
  const dominant = genderT < 0.5 ? "female" : "male";
  const profile = PROFILES[dominant];
  const H = profile.H;
  const bottomY = 0.02 * H;
  const topY = 1.03 * H;
  const cyc = reduceMotion ? 0.5 : (Math.sin(t * 0.5 - Math.PI / 2) + 1) / 2;
  const sweepY = bottomY + (topY - bottomY) * cyc;

  sweepDisc.position.y = sweepY;
  sweepDisc.scale.setScalar(H / 1.78);
  sweepLight.position.set(0, sweepY, 0.35);
  if (readoutB) readoutB.textContent = `${Math.round(cyc * 100)}%`;

  const figure = figures[dominant];
  const threshold = 0.045 * H;
  REGIONS.forEach((region) => {
    const hotspot = figure.hotspots.get(region.id);
    hotspot.anchor.getWorldPosition(tmpVec2);
    const inRange = Math.abs(tmpVec2.y - sweepY) < threshold;
    if (inRange && !scannedState.get(region.id)) flashRegion(region.id);
    scannedState.set(region.id, inRange);
  });
}

function decayPulses() {
  for (const figure of [figures.female, figures.male]) {
    for (const { dot } of figure.hotspots.values()) {
      dot.userData.pulse *= 0.88;
      if (dot.userData.pulse < 0.001) dot.userData.pulse = 0;
      dot.scale.setScalar(1 + dot.userData.pulse * 1.6);
    }
  }
}

/* ============================== Animation loop ============================== */

const clock = new THREE.Clock();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  const targetT = activeGender === "male" ? 1 : 0;
  genderT += (targetT - genderT) * Math.min(1, dt * 6);
  applyVisibility(figures.female, 1 - genderT);
  applyVisibility(figures.male, genderT);

  updateSweep(t);
  decayPulses();
  controls.update();
  updateWires();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
