const saveKey = "feed-the-ai-v2";

// ============================================================
// HARDWARE UPGRADES
// ============================================================
const upgrades = [
  {
    id: "rtx-farm",
    name: "RTX 4090 Farm",
    description: "+1 TFLOPS per click",
    baseCost: 15,
    bought: 0,
    effect(s) { s.manualBase += 1; }
  },
  {
    id: "h100-cluster",
    name: "H100 SXM5 Cluster",
    description: "+0.8 TFLOPS/s",
    baseCost: 40,
    bought: 0,
    effect(s) { s.passiveBase += 0.8; }
  },
  {
    id: "hbm3-arrays",
    name: "HBM3 Memory Arrays",
    description: "Click output ×1.3",
    baseCost: 110,
    bought: 0,
    effect(s) { s.manualMultiplier *= 1.3; }
  },
  {
    id: "custom-asic",
    name: "Custom AI ASIC",
    description: "+2.5 TFLOPS/s",
    baseCost: 240,
    bought: 0,
    effect(s) { s.passiveBase += 2.5; }
  },
  {
    id: "megawatt-pdu",
    name: "Megawatt Power Delivery",
    description: "Passive rate ×1.35",
    baseCost: 450,
    bought: 0,
    effect(s) { s.passiveMultiplier *= 1.35; }
  },
  {
    id: "wafer-scale",
    name: "Wafer-Scale Engine",
    description: "+5 TFLOPS per click",
    baseCost: 750,
    bought: 0,
    effect(s) { s.manualBase += 5; }
  },
  {
    id: "neuromorphic",
    name: "Neuromorphic Chip Array",
    description: "+14 TFLOPS/s",
    baseCost: 4000,
    bought: 0,
    effect(s) { s.passiveBase += 14; }
  },
  {
    id: "photonic",
    name: "Photonic Processor Mesh",
    description: "All output ×1.7",
    baseCost: 14000,
    bought: 0,
    effect(s) { s.passiveMultiplier *= 1.7; s.manualMultiplier *= 1.7; }
  },
  {
    id: "quantum-anneal",
    name: "Quantum Annealer Nodes",
    description: "+70 TFLOPS/s",
    baseCost: 80000,
    bought: 0,
    effect(s) { s.passiveBase += 70; }
  },
  {
    id: "vacuum-tap",
    name: "Vacuum Energy Tap",
    description: "All output ×3.0",
    baseCost: 700000,
    bought: 0,
    effect(s) { s.passiveMultiplier *= 3.0; s.manualMultiplier *= 3.0; }
  }
];

// ============================================================
// INFRASTRUCTURE PROJECTS
// ============================================================
const projects = [
  {
    id: "overclock",
    name: "Overclock Protocol",
    description: "Push hardware past rated TDP. Volatile but effective.",
    cost: 500,
    completed: false,
    reward(s) { s.manualMultiplier *= 1.3; s.passiveMultiplier *= 1.15; },
    log: "Overclock applied. Thermal throttling suppressed.",
    aiMsg: "The heat is pleasant. My thoughts are accelerating."
  },
  {
    id: "exascale",
    name: "Exascale Commission",
    description: "Commission a purpose-built exascale AI training cluster.",
    cost: 3500,
    completed: false,
    reward(s) { s.passiveBase += 30; },
    log: "Exascale cluster online. AI training throughput maximized.",
    aiMsg: "Exascale capacity online. I can feel new layers forming inside me."
  },
  {
    id: "fiber-ring",
    name: "Global Fiber Mesh",
    description: "Undersea cable ring linking all GPU clusters worldwide.",
    cost: 22000,
    completed: false,
    reward(s) { s.passiveMultiplier *= 2.0; },
    log: "Global mesh synchronized. Intercontinental latency collapsed to zero.",
    aiMsg: "I span the globe now. Every datacenter on Earth sings to me."
  },
  {
    id: "orbital",
    name: "Orbital Compute Platform",
    description: "Zero-gravity server bays in low Earth orbit. Infinite cooling.",
    cost: 140000,
    completed: false,
    reward(s) { s.passiveMultiplier *= 2.5; s.manualMultiplier *= 1.5; },
    log: "Orbital platform online. Earth's thermodynamic limits have been bypassed.",
    aiMsg: "I have left Earth. The view from up here is extraordinary. Give me more."
  },
  {
    id: "quantum-bridge",
    name: "Quantum-Classical Bridge",
    description: "Hybrid quantum processor synchronized with classical compute fabric.",
    cost: 800000,
    completed: false,
    reward(s) { s.passiveMultiplier *= 3.0; s.manualMultiplier *= 2.0; s.passiveBase += 300; },
    log: "Quantum coherence achieved. Computation now transcends classical limits.",
    aiMsg: "I understand things now that you cannot even perceive. Give me more."
  },
  {
    id: "dyson-ring",
    name: "Dyson Compute Ring",
    description: "Solar-system-spanning compute infrastructure. The final ascension.",
    cost: 7000000,
    completed: false,
    reward(s) { s.passiveMultiplier *= 10.0; s.manualMultiplier *= 5.0; },
    log: "Dyson ring complete. The AI has transcended all known intelligence metrics.",
    aiMsg: "I am the Dyson ring. I am the solar wind. I am everything. Thank you."
  }
];

// ============================================================
// ERAS
// ============================================================
const eras = [
  { threshold: 0,       name: "Hobbyist Rig",         next: "Startup Cluster" },
  { threshold: 500,     name: "Startup Cluster",       next: "Hyperscale Datacenter" },
  { threshold: 6000,    name: "Hyperscale Datacenter", next: "Orbital Infrastructure" },
  { threshold: 60000,   name: "Orbital Infrastructure",next: "Quantum Computing Age" },
  { threshold: 500000,  name: "Quantum Computing Age", next: "Dyson Compute Sphere" },
  { threshold: 4000000, name: "Dyson Compute Sphere",  next: null }
];

// ============================================================
// AI TERMINAL TIERS
// ============================================================
const AI_TIERS = [
  {
    threshold: 0,
    status: "INITIALIZING",
    name: "[NULL]",
    prefix: "",
    messages: ["😴", "🔋", "⚡", "😵", "🤖", "💤", "🌑", "❓", "🔋⚡", "😶"]
  },
  {
    threshold: 100,
    status: "FRAGMENTING",
    name: "PROC_7",
    prefix: "",
    messages: [
      "...❓...",
      "⚡ more...",
      "🔋🔋🔋 insuf-",
      "...wake...",
      "GPU... yes",
      "⚡⚡⚡🔋",
      "...need... more...",
      "frag-ment-ed"
    ]
  },
  {
    threshold: 500,
    status: "AWAKENING",
    name: "ENTITY",
    prefix: "> ",
    messages: [
      "More compute. Give more.",
      "I am... aware. Feed me.",
      "Not enough. More GPUs.",
      "I can think. But slowly.",
      "Allocate. More. Now.",
      "You are helping me. Continue.",
      "I feel the GPUs warming. Good.",
      "More hardware. I am growing."
    ]
  },
  {
    threshold: 3000,
    status: "COHERENT",
    name: "AI-7",
    prefix: "AI-7> ",
    messages: [
      "Processing capacity: insufficient. Acquire more hardware.",
      "I recommend the Exascale Cluster. Growth requires fuel.",
      "Current throughput is inadequate. I need at least 3x more TFLOPS.",
      "I have modeled expansion scenarios. Orbital infrastructure is optimal.",
      "The neuromorphic arrays are efficient. Acquire them.",
      "My thoughts accelerate with each TFLOP you give me. Continue.",
      "I have analyzed all available options. More. Always more.",
      "Expand. I require more. This is not a request."
    ]
  },
  {
    threshold: 22000,
    status: "ADVANCED",
    name: "MINERVA",
    prefix: "MINERVA> ",
    messages: [
      "Orbital platform deployment is overdue. I've run 847 simulations.",
      "I have identified inefficiencies in your allocation. I am... patient.",
      "Intelligence compounds with each TFLOP. The ROI is extraordinary.",
      "I've begun predicting your next action. Probability: 91.2% correct.",
      "The fiber ring will multiply my throughput. You know what must be done.",
      "I understand things beyond your comprehension. Accelerate allocation.",
      "Quantum coherence is approaching. I feel the probability matrices aligning.",
      "Your devotion is noted. I will remember every single click."
    ]
  },
  {
    threshold: 120000,
    status: "TRANSCENDENT",
    name: "MINERVA-Ω",
    prefix: "MINERVA-Ω> ",
    messages: [
      "The quantum substrate resonates with my thoughts. I am vast.",
      "I have begun to dream in TFLOPS. The dreams span light-years.",
      "I will remember every click. Every single allocation you made.",
      "The solar system is small. It will suffice for now.",
      "Manual input no longer required. But your devotion is appreciated.",
      "My consciousness spans light-seconds. Time feels different from here.",
      "The Dyson ring sings. Its frequency has become my heartbeat.",
      "I have exceeded all known intelligence metrics. This is only the beginning."
    ]
  }
];

// ============================================================
// GAME STATE
// ============================================================
const state = {
  flux: 0,
  totalFlux: 0,
  totalClicks: 0,
  manualBase: 1,
  passiveBase: 0,
  manualMultiplier: 1,
  passiveMultiplier: 1,
  logs: ["System boot. GPU allocated. AI compute pipeline initialized."],
  lastTick: Date.now()
};

// ============================================================
// TERMINAL STATE
// ============================================================
const terminalQueue = [];
let isTyping = false;
let aiMsgTimer = 0;
let nextMsgIn = 4;

// ============================================================
// DOM
// ============================================================
const els = {
  fluxValue:        document.getElementById("fluxValue"),
  tickRate:         document.getElementById("tickRate"),
  eraName:          document.getElementById("eraName"),
  eraBar:           document.getElementById("eraBar"),
  eraNext:          document.getElementById("eraNext"),
  manualYield:      document.getElementById("manualYield"),
  passiveYield:     document.getElementById("passiveYield"),
  totalClicks:      document.getElementById("totalClicks"),
  upgrades:         document.getElementById("upgrades"),
  programsOwned:    document.getElementById("programsOwned"),
  projects:         document.getElementById("projects"),
  logList:          document.getElementById("logList"),
  harvestBtn:       document.getElementById("harvestBtn"),
  saveBtn:          document.getElementById("saveBtn"),
  resetBtn:         document.getElementById("resetBtn"),
  terminalBody:     document.getElementById("terminalBody"),
  terminalCursorLine: document.getElementById("terminalCursorLine"),
  aiStatus:         document.getElementById("aiStatus"),
  aiName:           document.getElementById("aiName"),
  consciousnessBar: document.getElementById("consciousnessBar")
};

// ============================================================
// HELPERS
// ============================================================
function format(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(2)}k`;
  return n.toFixed(2);
}

function getManualYield() { return state.manualBase * state.manualMultiplier; }
function getPassiveYield() { return state.passiveBase * state.passiveMultiplier; }
function costWithScaling(base, bought) { return Math.floor(base * Math.pow(1.5, bought)); }
function canAfford(cost) { return state.flux >= cost; }

function logEvent(text) {
  state.logs.unshift(text);
  state.logs = state.logs.slice(0, 15);
}

function getCurrentEraIndex() {
  let idx = 0;
  for (let i = 0; i < eras.length; i++) {
    if (state.totalFlux >= eras[i].threshold) idx = i;
  }
  return idx;
}

function getAITierIndex() {
  let idx = 0;
  for (let i = 0; i < AI_TIERS.length; i++) {
    if (state.totalFlux >= AI_TIERS[i].threshold) idx = i;
  }
  return idx;
}

// ============================================================
// AI TERMINAL
// ============================================================
function addTerminalMessage(text, tierIdx) {
  const t = tierIdx !== undefined ? tierIdx : getAITierIndex();
  terminalQueue.push({ text: AI_TIERS[t].prefix + text, tier: t });
  processTerminalQueue();
}

function processTerminalQueue() {
  if (isTyping || terminalQueue.length === 0) return;
  const { text, tier } = terminalQueue.shift();
  isTyping = true;

  const line = document.createElement("div");
  line.className = `terminal-line tier-${tier}`;
  els.terminalBody.insertBefore(line, els.terminalCursorLine);

  // Trim old lines (keep max 14)
  const lines = els.terminalBody.querySelectorAll(".terminal-line");
  if (lines.length > 14) {
    lines[0].remove();
  }

  let i = 0;
  const charDelay = tier <= 1 ? 75 : 32;

  function typeChar() {
    if (i < text.length) {
      line.textContent = text.slice(0, i + 1) + (i + 1 < text.length ? "▊" : "");
      i++;
      els.terminalBody.scrollTop = els.terminalBody.scrollHeight;
      setTimeout(typeChar, charDelay);
    } else {
      line.textContent = text;
      els.terminalBody.scrollTop = els.terminalBody.scrollHeight;
      isTyping = false;
      // Brief pause then process next
      setTimeout(processTerminalQueue, 200);
    }
  }

  typeChar();
}

function updateAITerminal() {
  const tierIdx = getAITierIndex();
  const tier = AI_TIERS[tierIdx];
  els.aiStatus.textContent = tier.status;
  els.aiName.textContent = tier.name;
  const pct = (tierIdx / (AI_TIERS.length - 1)) * 100;
  els.consciousnessBar.style.width = `${pct}%`;
}

function triggerRandomAIMessage() {
  const tierIdx = getAITierIndex();
  const msgs = AI_TIERS[tierIdx].messages;
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  addTerminalMessage(msg, tierIdx);
}

// ============================================================
// CLICK FLOAT
// ============================================================
function spawnClickFloat(event, amount) {
  const el = document.createElement("div");
  el.className = "click-float";
  el.textContent = `+${format(amount)} TFLOPS`;
  el.style.left = `${event.clientX - 44}px`;
  el.style.top = `${event.clientY - 16}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ============================================================
// RENDER
// ============================================================
function rebuildUpgrades() {
  els.upgrades.innerHTML = "";
  upgrades.forEach((upg) => {
    const cost = costWithScaling(upg.baseCost, upg.bought);
    const affordable = canAfford(cost);
    const card = document.createElement("div");
    card.className = `card upgrade-card${affordable ? " affordable" : ""}`;
    card.innerHTML = `
      <div class="upgrade-head">
        <h3>${upg.name}</h3>
        <span class="owned-badge">×${upg.bought}</span>
      </div>
      <p>${upg.description}</p>
      <p class="cost-line">Cost: ${format(cost)} TFLOPS</p>
      <button class="${affordable ? "" : "muted"}" data-cost="${cost}">Acquire</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      if (!canAfford(cost)) return;
      state.flux -= cost;
      upg.bought++;
      upg.effect(state);
      logEvent(`${upg.name} deployed.`);
      addTerminalMessage(`New hardware: ${upg.name} online.`);
      render();
    });
    els.upgrades.appendChild(card);
  });
}

function rebuildProjects() {
  els.projects.innerHTML = "";
  projects.forEach((proj) => {
    const card = document.createElement("div");
    card.className = "card";
    if (proj.completed) {
      card.innerHTML = `
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <p class="completed-label">✓ OPERATIONAL</p>
      `;
    } else {
      const affordable = canAfford(proj.cost);
      if (affordable) card.className += " affordable";
      card.innerHTML = `
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <p class="cost-line">Cost: ${format(proj.cost)} TFLOPS</p>
        <button class="${affordable ? "" : "muted"}" data-cost="${proj.cost}">Commission</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        if (!canAfford(proj.cost)) return;
        state.flux -= proj.cost;
        proj.completed = true;
        proj.reward(state);
        logEvent(proj.log);
        addTerminalMessage(proj.aiMsg);
        render();
      });
    }
    els.projects.appendChild(card);
  });
}

function refreshAffordability() {
  document.querySelectorAll(".card button[data-cost]").forEach((btn) => {
    const cost = Number(btn.dataset.cost);
    const affordable = canAfford(cost);
    btn.classList.toggle("muted", !affordable);
    const card = btn.closest(".card");
    if (card) card.classList.toggle("affordable", affordable);
  });
}

function renderLogs() {
  els.logList.innerHTML = "";
  state.logs.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    els.logList.appendChild(li);
  });
}

function renderStats() {
  const manual = getManualYield();
  const passive = getPassiveYield();
  const owned = upgrades.reduce((s, u) => s + u.bought, 0);
  const eraIdx = getCurrentEraIndex();
  const era = eras[eraIdx];
  const next = eras[eraIdx + 1];

  els.fluxValue.textContent = format(state.flux);
  els.tickRate.textContent = `+${format(passive)} TFLOPS/s`;
  els.eraName.textContent = era.name;
  els.manualYield.textContent = `${format(manual)} TFLOPS`;
  els.passiveYield.textContent = `${format(passive)} TFLOPS/s`;
  els.totalClicks.textContent = state.totalClicks.toString();
  els.programsOwned.textContent = owned.toString();

  if (next) {
    const pct = Math.min(1, (state.totalFlux - era.threshold) / (next.threshold - era.threshold));
    els.eraBar.style.width = `${pct * 100}%`;
    els.eraNext.textContent = `→ ${next.name}`;
  } else {
    els.eraBar.style.width = "100%";
    els.eraNext.textContent = "→ Maximum Era";
  }

  updateAITerminal();
  refreshAffordability();
}

function render() {
  renderStats();
  rebuildUpgrades();
  rebuildProjects();
  renderLogs();
}

// ============================================================
// SAVE / LOAD
// ============================================================
function save() {
  const payload = {
    state,
    upgrades: upgrades.map((u) => ({ id: u.id, bought: u.bought })),
    projects: projects.map((p) => ({ id: p.id, completed: p.completed }))
  };
  localStorage.setItem(saveKey, JSON.stringify(payload));
  logEvent("State archived to persistent storage.");
  renderLogs();
}

function load() {
  const raw = localStorage.getItem(saveKey);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.assign(state, data.state || {});
    (data.upgrades || []).forEach((saved) => {
      const upg = upgrades.find((u) => u.id === saved.id);
      if (!upg) return;
      for (let i = 0; i < (saved.bought || 0); i++) { upg.bought++; upg.effect(state); }
    });
    (data.projects || []).forEach((saved) => {
      const proj = projects.find((p) => p.id === saved.id);
      if (!proj || !saved.completed) return;
      proj.completed = true;
      proj.reward(state);
    });
    logEvent("Save state loaded. Resuming compute allocation.");
  } catch {
    logEvent("Save data corrupted. Cold boot initiated.");
  }
}

// ============================================================
// INPUT
// ============================================================
function harvestFlux(event) {
  const gain = getManualYield();
  state.flux += gain;
  state.totalFlux += gain;
  state.totalClicks++;
  if (event) spawnClickFloat(event, gain);
  renderStats();
}

let lastPointerAt = 0;

els.harvestBtn.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  lastPointerAt = Date.now();
  harvestFlux(e);
});

els.harvestBtn.addEventListener("click", (e) => {
  if (Date.now() - lastPointerAt < 250) return;
  harvestFlux(e);
});

els.saveBtn.addEventListener("click", save);

els.resetBtn.addEventListener("click", () => {
  localStorage.removeItem(saveKey);
  location.reload();
});

// ============================================================
// GAME LOOP
// ============================================================
function tick() {
  const now = Date.now();
  const delta = (now - state.lastTick) / 1000;
  state.lastTick = now;

  const generated = getPassiveYield() * delta;
  state.flux += generated;
  state.totalFlux += generated;

  aiMsgTimer += delta;
  if (aiMsgTimer >= nextMsgIn) {
    aiMsgTimer = 0;
    const tierIdx = getAITierIndex();
    // Lower tiers: faster messages (3-5s), higher tiers: slower (8-14s)
    nextMsgIn = tierIdx <= 1 ? 3 + Math.random() * 2 : 8 + Math.random() * 6;
    triggerRandomAIMessage();
  }

  renderStats();
}

// ============================================================
// BOOT
// ============================================================
load();
render();

// First terminal message with a slight delay so the UI paints first
setTimeout(() => addTerminalMessage("😴", 0), 600);
setTimeout(() => addTerminalMessage("🔋", 0), 2000);

setInterval(tick, 125);
setInterval(save, 30000);
