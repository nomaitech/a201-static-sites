// Real photographic exposure math (full stops), used to drive both the
// in-game light meter and the render pipeline (brightness / DOF / trails / grain).

export const ISO_STOPS = [100, 200, 400, 800, 1600, 3200, 6400];
export const APERTURE_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
// shutter speeds in seconds, slowest to fastest is reversed for slider ergonomics (slow -> fast)
export const SHUTTER_STOPS = [1, 1 / 2, 1 / 4, 1 / 8, 1 / 15, 1 / 30, 1 / 60, 1 / 125, 1 / 250, 1 / 500, 1 / 1000];

export function formatISO(v) {
  return `ISO ${v}`;
}
export function formatAperture(v) {
  return `f/${v}`;
}
export function formatShutter(v) {
  if (v >= 1) return `${v}s`;
  return `1/${Math.round(1 / v)}s`;
}

// Exposure Value at ISO 100 from aperture (N) and shutter time in seconds (t)
function ev100(N, t) {
  return Math.log2((N * N) / t);
}

// Effective EV once ISO is applied (higher ISO lowers the effective EV needed)
export function effectiveEV(N, t, iso) {
  return ev100(N, t) - Math.log2(iso / 100);
}

// Meter reading, camera-style: negative = underexposed (too dark, left of center),
// positive = overexposed (too bright, right of center), 0 = correct.
export function meterValue(settings, targetEV) {
  return targetEV - effectiveEV(settings.aperture, settings.shutter, settings.iso);
}

// Convert the meter reading directly into a brightness multiplier for the render.
export function brightnessMultiplier(meterVal) {
  const mult = Math.pow(2, meterVal);
  return Math.min(8, Math.max(0.04, mult));
}

export function clampIndex(i, len) {
  return Math.min(len - 1, Math.max(0, i));
}

// --- Camera-model mappings: turn a real photographic setting into a render parameter ---

// Wider aperture (small f-number) -> bigger blur radius in pixels.
export function apertureToBlurPx(fNumber) {
  const px = 44 / (fNumber * fNumber);
  return Math.min(28, px);
}

// Wider aperture -> shallower zone that stays in focus (world units).
export function apertureToFocusRange(fNumber) {
  return Math.min(14, Math.max(1.0, fNumber * 0.9));
}

// Faster shutter -> less frame-to-frame blending -> motion frozen, no trail.
// Slower shutter -> heavy blending -> long light trails.
export function shutterToBlendFactor(t) {
  const minT = 1 / 1000;
  const maxT = 1;
  const n = (Math.log2(t) - Math.log2(minT)) / (Math.log2(maxT) - Math.log2(minT));
  return 1 - Math.min(1, Math.max(0, n)) * 0.94;
}

// Higher ISO -> more visible sensor grain.
export function isoToGrain(iso) {
  const n = Math.log2(iso / 100) / Math.log2(6400 / 100);
  return 0.015 + Math.min(1, Math.max(0, n)) * 0.2;
}
