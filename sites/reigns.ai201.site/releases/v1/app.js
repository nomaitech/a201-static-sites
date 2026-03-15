const cardEl = document.querySelector("#card");
const characterEl = document.querySelector("#character");
const subtitleEl = document.querySelector("#subtitle");
const promptEl = document.querySelector("#prompt");
const leftLabelEl = document.querySelector("#left-label");
const rightLabelEl = document.querySelector("#right-label");
const logEl = document.querySelector("#log");
const leftBtn = document.querySelector("#left-btn");
const rightBtn = document.querySelector("#right-btn");
const gameoverDialog = document.querySelector("#gameover");
const gameoverTitle = document.querySelector("#gameover-title");
const gameoverReason = document.querySelector("#gameover-reason");
const profileSummary = document.querySelector("#profile-summary");
const timeTogether = document.querySelector("#time-together");
const restartBtn = document.querySelector("#restart");
const meterLabelsEls = document.querySelectorAll(".meter-label");

const meters = {
  labor: 50,
  ethics: 50,
  capital: 50,
  influence: 50,
};

const meterLabels = {
  labor: "Attraction",
  ethics: "Trust",
  capital: "Spark",
  influence: "Freedom",
};

let relationshipDays = 0;

const cards = [
  {
    character: "The First Date",
    subtitle: "A new beginning.",
    prompt: "You lock eyes across the table. Do you lean into the chemistry or keep it light?",
    left: {
      label: "Keep Light",
      effects: { capital: -4, labor: -2, ethics: -3, influence: +4 },
      time: 3,
      result: "Easy laughs land, but the spark stays gentle.",
    },
    right: {
      label: "Lean In",
      effects: { capital: +6, labor: +4, ethics: +4, influence: -3 },
      time: 5,
      result: "The connection deepens faster than you expected.",
    },
  },
  {
    character: "The Exclusive Talk",
    subtitle: "Second month jitters.",
    prompt: "They ask to go exclusive. Do you say yes now?",
    left: {
      label: "Not Yet",
      effects: { influence: +8, ethics: +2, labor: -3, capital: -2 },
      time: 12,
      result: "You keep room to breathe, but uncertainty lingers.",
    },
    right: {
      label: "Say Yes",
      effects: { ethics: +8, labor: +5, capital: +4, influence: -6 },
      time: 16,
      result: "Commitment clicks, and your worlds start to merge.",
    },
  },
  {
    character: "The First Trip",
    subtitle: "Quarter-year mark.",
    prompt: "They want to take a weekend trip together.",
    left: {
      label: "Hold Off",
      effects: { influence: +6, ethics: +3, labor: -2, capital: -1 },
      time: 20,
      result: "You keep it local and steady, but adventure waits.",
    },
    right: {
      label: "Go",
      effects: { capital: +7, labor: +5, ethics: +2, influence: -5 },
      time: 28,
      result: "Shared memories deepen the bond quickly.",
    },
  },
  {
    character: "Meeting Friends",
    subtitle: "Half-year horizon.",
    prompt: "They invite you to a small dinner with their closest friends.",
    left: {
      label: "Postpone",
      effects: { influence: +6, ethics: +2, labor: -3, capital: -2 },
      time: 24,
      result: "You keep it intimate, but questions grow.",
    },
    right: {
      label: "Show Up",
      effects: { ethics: +6, labor: +4, capital: +3, influence: -4 },
      time: 30,
      result: "You fit in, and the relationship feels more real.",
    },
  },
  {
    character: "Moving In",
    subtitle: "Year one.",
    prompt: "They suggest moving in together at the one-year mark.",
    left: {
      label: "Pause",
      effects: { influence: +8, ethics: +4, labor: -4, capital: -2 },
      time: 60,
      result: "You slow the merge, holding onto independence.",
    },
    right: {
      label: "Move In",
      effects: { ethics: +8, labor: +6, capital: +4, influence: -7 },
      time: 90,
      result: "Life meshes quickly, and closeness increases.",
    },
  },
  {
    character: "The Career Shift",
    subtitle: "Year two.",
    prompt: "They get a job offer in another city. Do you move with them?",
    left: {
      label: "Stay",
      effects: { influence: +10, ethics: +2, labor: -4, capital: -3 },
      time: 120,
      result: "You protect your own path, but the distance grows.",
    },
    right: {
      label: "Move",
      effects: { ethics: +8, labor: +5, capital: +3, influence: -8 },
      time: 160,
      result: "You choose togetherness, and your world shifts.",
    },
  },
  {
    character: "The Conflict",
    subtitle: "Year two stress test.",
    prompt: "A serious argument erupts over priorities. How do you respond?",
    left: {
      label: "Take Space",
      effects: { influence: +7, ethics: -2, labor: -4, capital: -3 },
      time: 14,
      result: "Distance cools the heat, but it also cools closeness.",
    },
    right: {
      label: "Repair Now",
      effects: { ethics: +8, labor: +4, capital: +2, influence: -4 },
      time: 18,
      result: "You talk it through, even if it is uncomfortable.",
    },
  },
  {
    character: "Family Intro",
    subtitle: "Year three.",
    prompt: "They want to introduce you to their family.",
    left: {
      label: "Delay",
      effects: { influence: +6, ethics: +2, labor: -3, capital: -2 },
      time: 40,
      result: "You keep it private a little longer.",
    },
    right: {
      label: "Meet",
      effects: { ethics: +6, labor: +5, capital: +3, influence: -4 },
      time: 45,
      result: "You step into their world and feel seen.",
    },
  },
  {
    character: "Shared Finances",
    subtitle: "Year four.",
    prompt: "They want to open a joint account for shared goals.",
    left: {
      label: "Keep Separate",
      effects: { influence: +8, ethics: +2, labor: -3, capital: -2 },
      time: 60,
      result: "You keep autonomy, and trust grows slowly.",
    },
    right: {
      label: "Combine",
      effects: { ethics: +8, labor: +4, capital: +5, influence: -6 },
      time: 75,
      result: "You align on goals, and dependence deepens.",
    },
  },
  {
    character: "Long-Term Plans",
    subtitle: "Year five.",
    prompt: "They ask if you see a long-term future together.",
    left: {
      label: "Stay Vague",
      effects: { influence: +6, ethics: -4, labor: -3, capital: -2 },
      time: 90,
      result: "You keep it open-ended, and tension lingers.",
    },
    right: {
      label: "Commit",
      effects: { ethics: +8, labor: +5, capital: +4, influence: -6 },
      time: 110,
      result: "Clarity strengthens the bond and tests your freedom.",
    },
  },
  {
    character: "Renewal",
    subtitle: "Year six and beyond.",
    prompt: "The relationship feels routine. Do you plan a reset together?",
    left: {
      label: "Ride It Out",
      effects: { influence: +6, ethics: +2, labor: -4, capital: -3 },
      time: 140,
      result: "Stability stays, but the spark dims.",
    },
    right: {
      label: "Reignite",
      effects: { capital: +8, labor: +5, ethics: +4, influence: -6 },
      time: 170,
      result: "Fresh rituals bring closeness back to the surface.",
    },
  },
];

let deckIndex = 0;
let dragging = false;
let startX = 0;
let currentX = 0;
let activeDecision = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const updateMeters = () => {
  Object.entries(meters).forEach(([key, value]) => {
    const fill = document.querySelector(`[data-meter="${key}"]`);
    if (fill) {
      fill.style.width = `${value}%`;
    }
  });
};

const renderCard = () => {
  const card = cards[deckIndex % cards.length];
  characterEl.textContent = card.character;
  subtitleEl.textContent = card.subtitle;
  promptEl.textContent = card.prompt;
  leftLabelEl.textContent = card.left.label;
  rightLabelEl.textContent = card.right.label;
  logEl.textContent = "";
  activeDecision = card;
  cardEl.style.transform = "translateX(0px) rotate(0deg)";
};

const updateLog = (text) => {
  logEl.textContent = text;
};

const updateTime = () => {
  const years = Math.floor(relationshipDays / 365);
  const days = relationshipDays % 365;
  const yearLabel = years === 1 ? "year" : "years";
  const dayLabel = days === 1 ? "day" : "days";
  if (years > 0) {
    timeTogether.textContent = `${years} ${yearLabel} ${days} ${dayLabel}`;
  } else {
    timeTogether.textContent = `${days} ${dayLabel}`;
  }
};

const showDeltas = (effects) => {
  Object.entries(effects).forEach(([key, delta]) => {
    if (!delta) return;
    const fill = document.querySelector(`[data-meter="${key}"]`);
    const meter = fill?.closest(".meter");
    if (!meter) return;
    const badge = document.createElement("span");
    badge.className = `delta ${delta > 0 ? "positive" : "negative"}`;
    badge.textContent = `${delta > 0 ? "+" : ""}${delta}`;
    meter.appendChild(badge);
    window.setTimeout(() => badge.remove(), 1200);
  });
};

const applyEffects = (effects) => {
  Object.entries(effects).forEach(([key, delta]) => {
    if (meters[key] !== undefined) {
      meters[key] = clamp(meters[key] + delta, 0, 100);
    }
  });
  updateMeters();
  showDeltas(effects);
};

const buildProfileSummary = () => {
  const descriptors = {
    labor: {
      high: "magnetic and attentive",
      low: "hard to read",
    },
    ethics: {
      high: "steady and sincere",
      low: "guarded on trust",
    },
    capital: {
      high: "playful with a strong spark",
      low: "low on fireworks",
    },
    influence: {
      high: "independent and self-possessed",
      low: "clinging to closeness",
    },
  };
  const ranked = Object.entries(meters)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
  const top = ranked[0];
  const second = ranked[1];
  const low = ranked[ranked.length - 1];
  const topText = descriptors[top.key].high;
  const secondText = descriptors[second.key].high;
  const lowText = descriptors[low.key].low;
  return `Your dating profile: ${topText}, ${secondText}. Watch for being ${lowText}.`;
};

const evaluateEnding = () => {
  const entries = Object.entries(meters);
  for (const [key, value] of entries) {
    if (value <= 0) {
      return {
        title: "The Date Ends",
        reason: `${meterLabels[key]} collapses and the connection breaks.`,
      };
    }
    if (value >= 100) {
      return {
        title: "The Romance Overflows",
        reason: `${meterLabels[key]} overwhelms the balance you tried to keep.`,
      };
    }
  }
  return null;
};

const handleChoice = (direction) => {
  if (!activeDecision) return;
  const choice = direction === "left" ? activeDecision.left : activeDecision.right;
  applyEffects(choice.effects);
  updateLog(choice.result);
  relationshipDays += choice.time ?? 7;
  updateTime();

  const ending = evaluateEnding();
  if (ending) {
    gameoverTitle.textContent = ending.title;
    gameoverReason.textContent = ending.reason;
    profileSummary.textContent = buildProfileSummary();
    gameoverDialog.showModal();
    return;
  }

  deckIndex += 1;
  renderCard();
};

const onPointerDown = (event) => {
  if (gameoverDialog.open) return;
  dragging = true;
  startX = event.clientX;
  currentX = startX;
  cardEl.classList.add("dragging");
  cardEl.setPointerCapture(event.pointerId);
};

const onPointerMove = (event) => {
  if (!dragging) return;
  currentX = event.clientX;
  const delta = currentX - startX;
  const rotate = clamp(delta / 12, -12, 12);
  cardEl.style.transform = `translateX(${delta}px) rotate(${rotate}deg)`;
};

const onPointerUp = (event) => {
  if (!dragging) return;
  dragging = false;
  cardEl.classList.remove("dragging");
  const delta = currentX - startX;
  const threshold = Math.min(window.innerWidth * 0.25, 140);
  if (delta > threshold) {
    handleChoice("right");
  } else if (delta < -threshold) {
    handleChoice("left");
  } else {
    cardEl.style.transform = "translateX(0px) rotate(0deg)";
  }
  cardEl.releasePointerCapture(event.pointerId);
};

const onKeyDown = (event) => {
  if (event.key === "ArrowLeft") handleChoice("left");
  if (event.key === "ArrowRight") handleChoice("right");
};

const restartGame = () => {
  meters.labor = 50;
  meters.ethics = 50;
  meters.capital = 50;
  meters.influence = 50;
  relationshipDays = 0;
  deckIndex = 0;
  updateMeters();
  updateTime();
  renderCard();
  profileSummary.textContent = "";
  gameoverDialog.close();
};

leftBtn.addEventListener("click", () => handleChoice("left"));
rightBtn.addEventListener("click", () => handleChoice("right"));
cardEl.addEventListener("pointerdown", onPointerDown);
cardEl.addEventListener("pointermove", onPointerMove);
cardEl.addEventListener("pointerup", onPointerUp);
document.addEventListener("keydown", onKeyDown);
restartBtn.addEventListener("click", restartGame);

meterLabelsEls.forEach((label) => {
  const emoji = label.dataset.emoji || "";
  const text = label.dataset.label || "";
  label.addEventListener("click", () => {
    label.textContent = `${emoji} ${text}`.trim();
  });
});

updateMeters();
updateTime();
renderCard();
