const rounds = [
  {
    a: {
      title: "Portrait A",
      config: {
        skin: "#f5c7b1",
        hair: "#3c2b25",
        blouse: "#f1d4c2",
        background: "#f3e9dc",
        accent: "#b25e53",
        freckles: true,
      },
    },
    b: {
      title: "Portrait B",
      config: {
        skin: "#f4c3a8",
        hair: "#433029",
        blouse: "#e5d5c4",
        background: "#f2e5d4",
        accent: "#9f5a50",
        freckles: false,
      },
    },
    ai: "right",
    tells: [
      "Earring edges blur into hair strands.",
      "Left pupil catches light but right eye is flatter.",
      "Jawline transition is too perfect against the neck shadow.",
    ],
    feedback:
      "The AI portrait fuses jewelry with hair strands and smooths skin texture unnaturally.",
  },
  {
    a: {
      title: "Portrait A",
      config: {
        skin: "#f1bfa7",
        hair: "#2f2a3d",
        blouse: "#f0d1b3",
        background: "#efe2d7",
        accent: "#7c5c7a",
        freckles: false,
      },
    },
    b: {
      title: "Portrait B",
      config: {
        skin: "#f0bda4",
        hair: "#2a2436",
        blouse: "#efc8b0",
        background: "#eee1d4",
        accent: "#856073",
        freckles: true,
      },
    },
    ai: "left",
    tells: [
      "The necklace chain melts into the collarbone.",
      "Hair highlights repeat in a tiled pattern.",
      "Shoulder fabric folds mirror each other too perfectly.",
    ],
    feedback:
      "AI often repeats patterns; the hair sheen and clothing folds feel stamped.",
  },
  {
    a: {
      title: "Portrait A",
      config: {
        skin: "#f2c5b3",
        hair: "#4a3b33",
        blouse: "#e7d3c4",
        background: "#f1e6d6",
        accent: "#b0645a",
        freckles: true,
      },
    },
    b: {
      title: "Portrait B",
      config: {
        skin: "#f0c0ad",
        hair: "#3e312a",
        blouse: "#e5cfbf",
        background: "#efe0d1",
        accent: "#a35c53",
        freckles: true,
      },
    },
    ai: "right",
    tells: [
      "Stray hair disappears abruptly at the shoulder.",
      "The collar edge is smeared into the blouse.",
      "Light source doesn’t match the nose shadow.",
    ],
    feedback:
      "The synthetic portrait struggles with fine hair edges and coherent lighting.",
  },
  {
    a: {
      title: "Portrait A",
      config: {
        skin: "#f3c2a9",
        hair: "#29221f",
        blouse: "#edd7c7",
        background: "#f3e7d9",
        accent: "#a34f4d",
        freckles: false,
      },
    },
    b: {
      title: "Portrait B",
      config: {
        skin: "#f2bea3",
        hair: "#2c241f",
        blouse: "#ead2c1",
        background: "#f2e3d4",
        accent: "#ad5751",
        freckles: true,
      },
    },
    ai: "left",
    tells: [
      "Ear shape is inconsistent with the hairline.",
      "Lips have a sheen but no matching highlight on the nose.",
      "The necklace clasp is missing.",
    ],
    feedback:
      "Missing tiny structural details like clasps or ear edges are common AI tells.",
  },
  {
    a: {
      title: "Portrait A",
      config: {
        skin: "#f4c6b0",
        hair: "#3d2f2c",
        blouse: "#e9d0c0",
        background: "#f4e6d8",
        accent: "#a2574c",
        freckles: true,
      },
    },
    b: {
      title: "Portrait B",
      config: {
        skin: "#f1c0a9",
        hair: "#3a2c29",
        blouse: "#e6cbbb",
        background: "#f2e1d1",
        accent: "#9d534a",
        freckles: false,
      },
    },
    ai: "right",
    tells: [
      "Eye catchlights point in different directions.",
      "The hairline blends into the forehead.",
      "Shadow under the chin is too airbrushed.",
    ],
    feedback:
      "Inconsistent light direction and overly smooth shadows hint at synthesis.",
  },
];

const roundCount = document.getElementById("round-count");
const roundEl = document.getElementById("round");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const feedback = document.getElementById("feedback");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const nextBtn = document.getElementById("next-btn");
const revealBtn = document.getElementById("reveal-btn");
const tellsBox = document.getElementById("tells");
const tellsList = document.getElementById("tells-list");

roundCount.textContent = rounds.length.toString();

let currentRound = 0;
let score = 0;
let streak = 0;
let locked = false;

const makeSvg = (config) => {
  const freckles = config.freckles
    ? `<g fill="${config.accent}" opacity="0.35">
        <circle cx="260" cy="410" r="3" />
        <circle cx="280" cy="420" r="2" />
        <circle cx="330" cy="418" r="2" />
        <circle cx="350" cy="410" r="3" />
      </g>`
    : "";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${config.background}" />
          <stop offset="100%" stop-color="#f7f1e9" />
        </linearGradient>
        <linearGradient id="hair" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${config.hair}" />
          <stop offset="100%" stop-color="#1f1a18" />
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#bg)" />
      <circle cx="300" cy="260" r="210" fill="url(#hair)" />
      <path d="M160 300 q140 -160 280 0 v180 q0 160 -140 160 q-140 0 -140 -160z" fill="${config.skin}" />
      <path d="M210 320 q90 -80 180 0" fill="none" stroke="#442c2c" stroke-width="10" stroke-linecap="round" />
      <path d="M240 380 q30 -20 60 0" fill="none" stroke="#3a2626" stroke-width="8" stroke-linecap="round" />
      <path d="M300 390 q40 -20 80 0" fill="none" stroke="#3a2626" stroke-width="8" stroke-linecap="round" />
      <circle cx="260" cy="380" r="12" fill="#fff6f1" />
      <circle cx="340" cy="380" r="12" fill="#fff6f1" />
      <circle cx="260" cy="382" r="6" fill="#3a2626" />
      <circle cx="340" cy="382" r="6" fill="#3a2626" />
      <circle cx="256" cy="378" r="2" fill="#ffffff" />
      <circle cx="336" cy="378" r="2" fill="#ffffff" />
      <path d="M300 410 q-12 20 0 40" fill="none" stroke="#b08d7d" stroke-width="6" />
      <path d="M260 455 q40 30 80 0" fill="none" stroke="#9e4f51" stroke-width="10" stroke-linecap="round" />
      <path d="M190 380 q-40 60 -20 120 q15 45 70 50" fill="none" stroke="${config.hair}" stroke-width="20" stroke-linecap="round" />
      <path d="M410 380 q40 60 20 120 q-15 45 -70 50" fill="none" stroke="${config.hair}" stroke-width="20" stroke-linecap="round" />
      <circle cx="210" cy="450" r="16" fill="#dcb3a1" />
      <circle cx="390" cy="450" r="16" fill="#dcb3a1" />
      <path d="M160 620 q140 -70 280 0 v140 H160z" fill="${config.blouse}" />
      <path d="M260 600 q40 20 80 0" fill="none" stroke="${config.accent}" stroke-width="6" stroke-linecap="round" />
      <circle cx="260" cy="600" r="8" fill="${config.accent}" />
      <circle cx="340" cy="600" r="8" fill="${config.accent}" />
      ${freckles}
    </svg>
  `;
};

const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const renderRound = () => {
  const round = rounds[currentRound];
  leftBtn.querySelector("img").src = svgToDataUri(makeSvg(round.a.config));
  rightBtn.querySelector("img").src = svgToDataUri(makeSvg(round.b.config));
  leftBtn.querySelector("img").alt = round.a.title;
  rightBtn.querySelector("img").alt = round.b.title;
  roundEl.textContent = `${currentRound + 1}`;
  feedback.hidden = true;
  tellsBox.hidden = true;
  tellsList.innerHTML = "";
  locked = false;
};

const setResult = (choice) => {
  if (locked) return;
  locked = true;
  const round = rounds[currentRound];
  const correct = choice === round.ai;
  resultTitle.textContent = correct ? "Correct" : "Not quite";
  resultText.textContent = round.feedback;

  if (correct) {
    score += 1;
    streak += 1;
  } else {
    streak = 0;
  }

  scoreEl.textContent = score.toString();
  streakEl.textContent = streak.toString();
  feedback.hidden = false;
};

const revealTells = () => {
  const round = rounds[currentRound];
  tellsList.innerHTML = "";
  round.tells.forEach((tell) => {
    const li = document.createElement("li");
    li.textContent = tell;
    tellsList.appendChild(li);
  });
  tellsBox.hidden = false;
};

leftBtn.addEventListener("click", () => setResult("left"));
rightBtn.addEventListener("click", () => setResult("right"));
revealBtn.addEventListener("click", revealTells);
nextBtn.addEventListener("click", () => {
  currentRound += 1;
  if (currentRound >= rounds.length) {
    currentRound = 0;
    score = 0;
    streak = 0;
    scoreEl.textContent = "0";
    streakEl.textContent = "0";
  }
  renderRound();
});

renderRound();
