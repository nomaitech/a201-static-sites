import { ISO_STOPS, APERTURE_STOPS, SHUTTER_STOPS, formatISO, formatAperture, formatShutter } from "./exposure.js";
import { LEVELS } from "./levels.js";

const PROGRESS_KEY = "exposure-quest-progress-v1";

const CONTROL_DEFS = {
  iso: { label: "ISO", icon: "🔆", stops: ISO_STOPS, format: formatISO },
  aperture: { label: "Aperture", icon: "⭕", stops: APERTURE_STOPS, format: formatAperture },
  shutter: { label: "Shutter", icon: "⏱️", stops: SHUTTER_STOPS, format: formatShutter },
};

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(levelId, stars) {
  const p = loadProgress();
  p[levelId] = Math.max(p[levelId] || 0, stars);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  return p;
}

const el = (id) => document.getElementById(id);

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  el(id).classList.add("active");
}

export function initUI(handlers) {
  document.getElementById("ui-root").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    handlers[toCamel(action)] && handlers[toCamel(action)](btn);
  });
}

function toCamel(action) {
  return "on" + action.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());
}

export function renderLevelList(onSelect) {
  const list = el("level-list");
  list.innerHTML = "";
  const progress = loadProgress();
  LEVELS.forEach((level, i) => {
    const prevId = LEVELS[i - 1] && LEVELS[i - 1].id;
    const locked = i > 0 && !(progress[prevId] > 0);
    const stars = progress[level.id] || 0;
    const card = document.createElement("div");
    card.className = "level-card" + (locked ? " locked" : "");
    card.innerHTML = `
      <div class="lc-icon">${level.icon}</div>
      <div class="lc-body">
        <h3>${level.name}</h3>
        <p>${locked ? "Complete the previous lesson to unlock" : level.brief || describeLevel(level)}</p>
      </div>
      <div class="lc-stars">${locked ? "🔒" : starString(stars)}</div>
    `;
    if (!locked) card.addEventListener("click", () => onSelect(level.id));
    list.appendChild(card);
  });
}

function describeLevel(level) {
  if (level.id === "aperture") return "Learn depth of field with your aperture.";
  if (level.id === "shutter") return "Freeze or blur motion with shutter speed.";
  return "Practice";
}

function starString(n) {
  if (n <= 0) return "☆☆☆";
  return "★".repeat(n) + "☆".repeat(3 - n);
}

export function buildControls(level, indices, onChange) {
  const panel = el("controls-panel");
  panel.innerHTML = "";
  ["iso", "aperture", "shutter"].forEach((key) => {
    const def = CONTROL_DEFS[key];
    const enabled = level.controls[key];
    const wrap = document.createElement("div");
    wrap.className = "control" + (enabled ? "" : " disabled");
    wrap.innerHTML = `
      <div class="control-row1">
        <span class="control-name">${def.icon} ${def.label} ${enabled ? "" : '<span class="control-locked-tag">locked</span>'}</span>
        <span class="control-value" id="val-${key}">${def.format(def.stops[indices[key + "Idx"]])}</span>
      </div>
      <input type="range" id="slider-${key}" min="0" max="${def.stops.length - 1}" step="1" value="${indices[key + "Idx"]}" ${enabled ? "" : "disabled"} />
    `;
    panel.appendChild(wrap);
    if (enabled) {
      const input = wrap.querySelector("input");
      input.addEventListener("input", () => {
        const idx = parseInt(input.value, 10);
        el(`val-${key}`).textContent = def.format(def.stops[idx]);
        onChange(key, idx);
      });
    }
  });
}

export function setControlValue(key, idx) {
  const def = CONTROL_DEFS[key];
  const val = el(`val-${key}`);
  const slider = el(`slider-${key}`);
  if (val) val.textContent = def.format(def.stops[idx]);
  if (slider) slider.value = idx;
}

export function updateMeter(meterVal) {
  const clamped = Math.max(-3, Math.min(3, meterVal));
  const pct = 50 + (clamped / 3) * 50;
  const needle = el("meter-needle");
  needle.style.left = pct + "%";
  const label = el("meter-label");
  if (Math.abs(meterVal) <= 0.4) label.textContent = "PERFECT EXPOSURE";
  else if (meterVal < 0) label.textContent = "UNDEREXPOSED";
  else label.textContent = "OVEREXPOSED";
}

let tipTimer = null;
export function showTip(text) {
  const toast = el("tip-toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(tipTimer);
  tipTimer = setTimeout(() => toast.classList.remove("show"), 6000);
}

export function hideTip() {
  el("tip-toast").classList.remove("show");
}

export function setHud(name, brief) {
  el("hud-level-name").textContent = name;
  el("hud-brief").textContent = brief;
}

export function showResult({ stars, title, detail, canvasSource }) {
  el("result-stars").textContent = starString(stars);
  el("result-title").textContent = title;
  el("result-detail").textContent = detail;
  const target = el("result-photo");
  const ctx = target.getContext("2d");
  target.width = canvasSource.width;
  target.height = canvasSource.height;
  ctx.drawImage(canvasSource, 0, 0);
  showScreen("screen-result");
}
