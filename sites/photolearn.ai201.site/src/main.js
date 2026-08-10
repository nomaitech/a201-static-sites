import * as THREE from "three";
import { PostFX } from "./postfx.js";
import { LEVELS, getLevel } from "./levels.js";
import {
  ISO_STOPS,
  APERTURE_STOPS,
  SHUTTER_STOPS,
  meterValue,
  brightnessMultiplier,
  apertureToBlurPx,
  apertureToFocusRange,
  shutterToBlendFactor,
  isoToGrain,
} from "./exposure.js";
import * as ui from "./ui.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 60);
const postfx = new PostFX(renderer);

let currentLevel = null;
let currentVariant = null;
let currentVariantKind = null;
let currentScene = null;
let sceneCtl = null;
let indices = { isoIdx: 2, apertureIdx: 4, shutterIdx: 5 };
let levelStartTime = 0;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, true);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  const dpr = renderer.getPixelRatio();
  postfx.setSize(w * dpr * 0.85, h * dpr * 0.85);
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 250));
resize();

function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m.dispose());
    }
  });
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function currentValues() {
  return {
    iso: ISO_STOPS[indices.isoIdx],
    aperture: APERTURE_STOPS[indices.apertureIdx],
    shutter: SHUTTER_STOPS[indices.shutterIdx],
  };
}

function loadLevelScene(id, forcedVariantKind) {
  const level = getLevel(id);
  currentLevel = level;
  currentVariantKind = level.variants ? forcedVariantKind || pickRandom(level.variants) : null;
  currentVariant = currentVariantKind ? level.pickVariant(currentVariantKind) : null;

  if (currentScene) disposeScene(currentScene);
  currentScene = new THREE.Scene();
  currentScene.background = new THREE.Color(level.background);
  if (level.fog) currentScene.fog = new THREE.Fog(level.fog[0], level.fog[1], level.fog[2]);

  camera.position.set(...level.cameraPos);
  camera.lookAt(new THREE.Vector3(...level.cameraLookAt));

  sceneCtl = level.build(currentScene);
  postfx.reset();
  levelStartTime = performance.now() / 1000;

  indices = { ...level.initialIdx, ...(level.fixedIdx || {}) };
  return level;
}

function startLevel(id, forcedVariantKind) {
  const level = loadLevelScene(id, forcedVariantKind);
  ui.buildControls(level, indices, onSliderChange);
  const briefText = currentVariant ? currentVariant.brief : level.brief;
  const tipText = currentVariant ? currentVariant.tip : level.tip;
  ui.setHud(level.name, briefText);
  pendingTip = tipText;
  ui.showTip(tipText);
  ui.showScreen("screen-game");
}

let pendingTip = "";

function onSliderChange(key, idx) {
  indices[key + "Idx"] = idx;
}

// ---------------- audio ----------------
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function beep(freq, dur, type, gain, delay = 0) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(g).connect(ctx.destination);
    const startT = ctx.currentTime + delay;
    g.gain.setValueAtTime(gain, startT);
    g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
    osc.start(startT);
    osc.stop(startT + dur + 0.02);
  } catch (e) {
    /* audio not available, ignore */
  }
}
function playShutterSound() {
  beep(1900, 0.03, "square", 0.12);
  beep(260, 0.05, "square", 0.08, 0.03);
}
function playResultSound(stars) {
  if (stars >= 2) {
    [523, 659, 784].slice(0, stars + 1).forEach((f, i) => beep(f, 0.16, "sine", 0.1, i * 0.09));
  } else {
    beep(180, 0.25, "sawtooth", 0.08, 0);
  }
}

function flash() {
  const f = document.getElementById("flash-overlay");
  f.classList.add("active");
  requestAnimationFrame(() => setTimeout(() => f.classList.remove("active"), 40));
}

// ---------------- capture / scoring ----------------
function doCapture() {
  flash();
  playShutterSound();

  const level = currentLevel;
  const vals = currentValues();
  const mVal = meterValue(vals, level.targetEV);
  const tol = level.tolerance;
  const absM = Math.abs(mVal);
  const expCredit = absM <= tol.great ? 1 : absM <= tol.ok ? 0.6 : 0;

  const components = [{ label: "Exposure", credit: expCredit, max: 1 }];

  if (currentVariant) {
    const ok = currentVariant.check(indices);
    components.push({ label: currentVariant.requirementLabel, credit: ok ? 1 : 0, max: 1 });
  } else if (level.id === "combined") {
    const res = level.check(indices);
    components.push({ label: level.requirementLabels.dof, credit: res.dof ? 1 : 0, max: 1 });
    components.push({ label: level.requirementLabels.motion, credit: res.motion ? 1 : 0, max: 1 });
  }

  const total = components.reduce((s, c) => s + c.credit, 0);
  const max = components.reduce((s, c) => s + c.max, 0);
  const ratio = total / max;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.55 ? 2 : ratio > 0 ? 1 : 0;

  ui.saveProgress(level.id, stars);

  const detail = components.map((c) => `${c.credit >= c.max ? "✔" : "✖"} ${c.label}`).join("   ");
  const title = stars === 3 ? "Perfect shot!" : stars === 2 ? "Nice shot!" : stars === 1 ? "Getting there…" : "Missed the shot";

  setTimeout(() => {
    ui.showResult({ stars, title, detail, canvasSource: renderer.domElement });
    playResultSound(stars);
  }, 70);
}

function goNext() {
  const idx = LEVELS.findIndex((l) => l.id === currentLevel.id);
  const next = LEVELS[idx + 1];
  if (next) startLevel(next.id);
  else {
    ui.renderLevelList(startLevel);
    ui.showScreen("screen-levels");
  }
}

// ---------------- UI wiring ----------------
ui.initUI({
  onShowTitle: () => ui.showScreen("screen-title"),
  onShowAbout: () => ui.showScreen("screen-about"),
  onShowLevels: () => {
    ui.renderLevelList(startLevel);
    ui.showScreen("screen-levels");
  },
  onShowTip: () => ui.showTip(pendingTip),
  onCapture: () => doCapture(),
  onRetry: () => startLevel(currentLevel.id, currentVariantKind),
  onNextLevel: () => goNext(),
});

// idle background scene before the player picks a lesson
loadLevelScene(LEVELS[0].id);

// ---------------- render loop ----------------
function animate() {
  requestAnimationFrame(animate);
  if (!currentScene) return;

  const t = performance.now() / 1000 - levelStartTime;
  if (sceneCtl) sceneCtl.update(t);

  const vals = currentValues();
  const mVal = meterValue(vals, currentLevel.targetEV);
  ui.updateMeter(mVal);

  postfx.render(currentScene, camera, {
    focusDistance: currentLevel.focusDistance,
    focusRange: apertureToFocusRange(vals.aperture),
    blurPx: apertureToBlurPx(vals.aperture),
    blendFactor: shutterToBlendFactor(vals.shutter),
    exposure: brightnessMultiplier(mVal),
    grainAmount: isoToGrain(vals.iso),
    time: t,
  });
}
animate();
