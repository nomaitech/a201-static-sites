(() => {
  "use strict";

  const MIN_HITS = 4;
  const MAX_HITS = 9;
  const KEY_MATCH_MIN_HITS = 1;
  const KEY_MATCH_MAX_HITS = 2;
  const STORAGE_KEY_TOOLS = "crackTheChest.unlocked";
  const STORAGE_KEY_KEYS = "crackTheChest.keys";
  const STORAGE_KEY_CRAFTED = "crackTheChest.crafted";
  const STORAGE_KEY_FOUND_COUNTS = "crackTheChest.foundCounts";

  const chestBtn = document.getElementById("chestBtn");
  const chestSvg = document.getElementById("chestSvg");
  const bodyShape = document.getElementById("bodyShape");
  const lidShapeWrap = document.getElementById("lidShapeWrap");
  const lockShapeWrap = document.getElementById("lockShapeWrap");
  const stage = document.getElementById("stage");
  const fxLayer = document.getElementById("fxLayer");
  const rays = document.getElementById("rays");
  const shockwave = document.getElementById("shockwave");
  const hintText = document.getElementById("hintText");
  const hintFooter = document.getElementById("hintFooter");
  const keyChip = document.getElementById("keyChip");
  const scrim = document.getElementById("scrim");
  const sheet = document.getElementById("sheet");
  const sheetKicker = document.getElementById("sheetKicker");
  const sheetTitle = document.getElementById("sheetTitle");
  const continueBtn = document.getElementById("continueBtn");
  const toolBadge = document.getElementById("toolBadge");
  const toolCountBadge = document.getElementById("toolCountBadge");
  const toolNameEl = document.getElementById("toolName");
  const toolDescEl = document.getElementById("toolDesc");

  const menuBtn = document.getElementById("menuBtn");
  const menuScrim = document.getElementById("menuScrim");
  const menuDrawer = document.getElementById("menuDrawer");
  const menuClose = document.getElementById("menuClose");
  const toolsSubtitle = document.getElementById("toolsSubtitle");
  const craftedSubtitle = document.getElementById("craftedSubtitle");
  const keysSubtitle = document.getElementById("keysSubtitle");
  const toolList = document.getElementById("toolList");
  const craftedList = document.getElementById("craftedList");
  const keyList = document.getElementById("keyList");

  const tabChestBtn = document.getElementById("tabChestBtn");
  const tabWorkshopBtn = document.getElementById("tabWorkshopBtn");
  const workshopPanel = document.getElementById("workshopPanel");
  const workshopHint = document.getElementById("workshopHint");
  const slotA = document.getElementById("slotA");
  const slotB = document.getElementById("slotB");
  const combineBtn = document.getElementById("combineBtn");
  const workshopResult = document.getElementById("workshopResult");
  const workshopInventory = document.getElementById("workshopInventory");

  const HIT_WORDS = ["THWACK!", "BONK!", "CRACK!", "BAM!", "WHAM!", "POW!", "SMACK!"];
  const WORD_COLORS = ["var(--coral)", "var(--gold)", "var(--spark)"];

  const ICON_HAMMER = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><rect x="44" y="38" width="14" height="52" rx="3" transform="rotate(18 51 64)"/><rect x="24" y="14" width="46" height="26" rx="5"/></g></svg>`;
  const ICON_WRENCH = `<svg viewBox="0 0 100 100"><path d="M66 14a20 20 0 0 0-27 22L14 61l9 9 25-25a20 20 0 0 0 22-27l-11 11-10-10z" fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const ICON_COMPASS = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="18" r="7" fill="var(--paper)"/><path d="M50 25 L26 88"/><path d="M50 25 L74 88"/><circle cx="26" cy="88" r="4" fill="var(--ink)"/></g></svg>`;
  const ICON_LOUPE = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6"><circle cx="42" cy="42" r="26"/><line x1="61" y1="61" x2="86" y2="86" stroke-linecap="round" stroke-width="9"/></g></svg>`;
  const ICON_KEY = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><circle cx="30" cy="30" r="16"/><path d="M42 42 L82 82"/><path d="M70 70 L82 58"/><path d="M78 78 L90 66"/></g></svg>`;
  const ICON_LOCK = `<svg viewBox="0 0 100 100"><g fill="var(--cream-dim)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 42 a18 18 0 0 1 36 0 v10 h-36 z" fill="none"/><rect x="26" y="42" width="48" height="38" rx="7"/></g></svg>`;

  const ICON_SCREWDRIVER = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="44" y="10" width="12" height="16" rx="2"/><rect x="46" y="24" width="8" height="44"/><path d="M50 68 L34 88 L50 96 L66 88 Z"/></g></svg>`;
  const ICON_SAW = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M20 78 L74 24 L86 36 L32 90 Z"/><path d="M74 24 L86 12"/><path d="M20 78 L8 90"/></g></svg>`;
  const ICON_NAIL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="40" y="8" width="20" height="10" rx="2"/><rect x="46" y="18" width="8" height="56"/><path d="M46 74 L50 92 L54 74 Z"/></g></svg>`;
  const ICON_BUCKET = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M28 34 L72 34 L64 84 L36 84 Z"/><path d="M28 34 Q50 46 72 34"/><path d="M34 34 Q50 12 66 34"/></g></svg>`;
  const ICON_LADDER = `<svg viewBox="0 0 100 100"><g stroke="var(--ink)" stroke-width="6" stroke-linecap="round"><line x1="30" y1="10" x2="24" y2="90"/><line x1="70" y1="10" x2="76" y2="90"/><line x1="27" y1="28" x2="73" y2="28"/><line x1="26" y1="50" x2="74" y2="50"/><line x1="25" y1="72" x2="75" y2="72"/></g></svg>`;
  const ICON_SHOVEL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><line x1="50" y1="10" x2="50" y2="58"/><path d="M28 58 H72 L64 88 H36 Z"/></g></svg>`;
  const ICON_AXE = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><line x1="30" y1="88" x2="66" y2="20"/><path d="M60 12 L86 26 L70 42 L50 34 Z"/></g></svg>`;
  const ICON_SCISSORS = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><circle cx="26" cy="70" r="10"/><circle cx="26" cy="30" r="10"/><path d="M34 66 L84 20"/><path d="M34 34 L84 80"/></g></svg>`;
  const ICON_MAGNET = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"><path d="M30 20 V54 A20 20 0 0 0 70 54 V20"/></g><g fill="var(--ink)"><rect x="20" y="12" width="20" height="14" rx="3"/><rect x="60" y="12" width="20" height="14" rx="3"/></g></svg>`;
  const ICON_GEAR = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="9" fill="var(--cream)"/></g><g stroke="var(--ink)" stroke-width="8" stroke-linecap="round"><line x1="50" y1="16" x2="50" y2="28"/><line x1="50" y1="72" x2="50" y2="84"/><line x1="16" y1="50" x2="28" y2="50"/><line x1="72" y1="50" x2="84" y2="50"/><line x1="27" y1="27" x2="35" y2="35"/><line x1="65" y1="65" x2="73" y2="73"/><line x1="73" y1="27" x2="65" y2="35"/><line x1="35" y1="65" x2="27" y2="73"/></g></svg>`;
  const ICON_PAINTBRUSH = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="46" y="10" width="8" height="34"/><rect x="40" y="42" width="20" height="14" rx="3"/><path d="M40 56 L60 56 L54 90 L46 90 Z"/></g></svg>`;
  const ICON_RULER = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" transform="rotate(-8 50 50)"><rect x="12" y="40" width="76" height="20" rx="3"/><g stroke="var(--ink)" stroke-width="4"><line x1="24" y1="40" x2="24" y2="50"/><line x1="38" y1="40" x2="38" y2="50"/><line x1="52" y1="40" x2="52" y2="50"/><line x1="66" y1="40" x2="66" y2="50"/></g></g></svg>`;
  const ICON_PLIERS = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M30 30 L50 54 L28 84"/><path d="M70 30 L50 54 L72 84"/><circle cx="50" cy="54" r="6" fill="var(--ink)"/></g></svg>`;
  const ICON_FLASHLIGHT = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><rect x="38" y="40" width="24" height="50" rx="4"/><path d="M34 40 L66 40 L58 22 L42 22 Z"/></g><g stroke="var(--ink)" stroke-width="4" stroke-linecap="round"><line x1="14" y1="14" x2="24" y2="24"/><line x1="4" y1="30" x2="18" y2="34"/></g></svg>`;
  const ICON_ROPE = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="6"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="10"/></g></svg>`;
  const ICON_ANCHOR = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="18" r="8"/><line x1="50" y1="26" x2="50" y2="78"/><line x1="30" y1="40" x2="70" y2="40"/><path d="M26 60 Q26 84 50 86 Q74 84 74 60"/></g></svg>`;
  const ICON_QUILL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M78 14 C40 20 22 50 22 84 C50 78 66 60 74 30 Z"/><line x1="24" y1="82" x2="14" y2="92"/></g></svg>`;
  const ICON_HOOK = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"><line x1="46" y1="10" x2="46" y2="60"/><path d="M46 60 A20 20 0 1 0 30 44"/></g></svg>`;
  const ICON_BELL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M50 16 C30 16 26 40 26 54 L20 72 H80 L74 54 C74 40 70 16 50 16 Z"/><circle cx="50" cy="84" r="7"/></g></svg>`;
  const ICON_DRILL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="20" y="34" width="46" height="24" rx="6"/><path d="M66 40 L88 46 L88 52 L66 52 Z"/><path d="M36 58 L30 84"/></g></svg>`;
  const ICON_FUNNEL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><path d="M16 18 H84 L58 52 V78 H42 V52 Z"/></g></svg>`;
  const ICON_SPOOL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><rect x="30" y="18" width="40" height="64" rx="6"/><ellipse cx="50" cy="18" rx="20" ry="8"/><ellipse cx="50" cy="82" rx="20" ry="8"/><path d="M32 34 Q50 44 68 34 M32 50 Q50 60 68 50 M32 66 Q50 76 68 66" fill="none" stroke-width="4"/></g></svg>`;
  const ICON_CHISEL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="42" y="10" width="16" height="34" rx="4"/><path d="M40 44 H60 L52 90 H48 Z"/></g></svg>`;
  const ICON_LEVEL = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><rect x="10" y="42" width="80" height="18" rx="4"/><circle cx="50" cy="51" r="7" fill="var(--cream)"/></g></svg>`;
  const ICON_OILCAN = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M30 40 H62 V84 H30 Z"/><path d="M62 50 L86 30"/><path d="M40 40 V26 Q40 16 50 16 Q56 16 56 24 V40"/></g></svg>`;
  const ICON_HORSESHOE = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"><path d="M28 20 V52 A22 22 0 0 0 72 52 V20"/></g><g fill="var(--ink)"><circle cx="28" cy="18" r="4"/><circle cx="72" cy="18" r="4"/><circle cx="24" cy="34" r="4"/><circle cx="76" cy="34" r="4"/></g></svg>`;
  const ICON_SPATULA = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><line x1="50" y1="20" x2="50" y2="56"/><path d="M28 56 H72 L66 84 H34 Z"/><line x1="36" y1="64" x2="36" y2="78"/><line x1="50" y1="64" x2="50" y2="78"/><line x1="64" y1="64" x2="64" y2="78"/></g></svg>`;
  const ICON_NEEDLE = `<svg viewBox="0 0 100 100"><g fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"><line x1="20" y1="80" x2="82" y2="18"/><ellipse cx="86" cy="14" rx="7" ry="4" transform="rotate(45 86 14)"/></g></svg>`;
  const ICON_GLUE = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><path d="M36 34 H64 V26 H36 Z"/><path d="M32 34 H68 L72 88 H28 Z"/><rect x="44" y="14" width="12" height="12" rx="2"/></g></svg>`;
  const ICON_WHISTLE = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M20 50 H58 V34 H20 Z"/><circle cx="70" cy="50" r="18"/><circle cx="70" cy="50" r="5" fill="var(--ink)"/></g></svg>`;

  const TOOLS = [
    { id: "hammer", name: "THE LUCKY HAMMER", desc: "Smashes locked crates in a single swing. Never misses, rarely apologizes.", icon: ICON_HAMMER },
    { id: "wrench", name: "THE BENDY WRENCH", desc: "Fits every bolt it meets, even the ones that don't exist yet.", icon: ICON_WRENCH },
    { id: "compass", name: "THE TRUE COMPASS", desc: "Always points toward the next chest. Occasionally toward snacks.", icon: ICON_COMPASS },
    { id: "loupe", name: "THE KEEN LOUPE", desc: "Reveals hidden switches, secret seams, and questionable life choices.", icon: ICON_LOUPE },
    { id: "key", name: "THE MASTER KEY", desc: "Opens 9 out of 10 locks. The 10th is personal.", icon: ICON_KEY },
    { id: "screwdriver", name: "THE STUBBORN SCREWDRIVER", desc: "Turns anything, eventually. Mostly your patience.", icon: ICON_SCREWDRIVER },
    { id: "saw", name: "THE SINGING SAW", desc: "Cuts clean through wood, doubts, and awkward silences.", icon: ICON_SAW },
    { id: "nail", name: "THE LUCKY NAIL", desc: "Bent twice, still true. Holds grudges and shelves equally well.", icon: ICON_NAIL },
    { id: "bucket", name: "THE BOTTOMLESS BUCKET", desc: "Carries water, sand, or vague regret. Never quite full.", icon: ICON_BUCKET },
    { id: "ladder", name: "THE FOLDING LADDER", desc: "Reaches exactly as high as your ambitions, then six inches more.", icon: ICON_LADDER },
    { id: "shovel", name: "THE HONEST SHOVEL", desc: "Digs holes and digs up truths nobody asked for.", icon: ICON_SHOVEL },
    { id: "axe", name: "THE QUIET AXE", desc: "Splits logs without a word of complaint.", icon: ICON_AXE },
    { id: "scissors", name: "THE SHARP SCISSORS", desc: "Cuts ribbons, red tape, and small talk.", icon: ICON_SCISSORS },
    { id: "magnet", name: "THE STUBBORN MAGNET", desc: "Attracts loose screws and bad decisions alike.", icon: ICON_MAGNET },
    { id: "gear", name: "THE SPARE GEAR", desc: "Fits no machine in particular. Fits every machine eventually.", icon: ICON_GEAR },
    { id: "paintbrush", name: "THE TIDY PAINTBRUSH", desc: "Paints fences, walls, and over past mistakes.", icon: ICON_PAINTBRUSH },
    { id: "ruler", name: "THE CROOKED RULER", desc: "Measures twice, cuts once. Off by a little, every time.", icon: ICON_RULER },
    { id: "pliers", name: "THE FIRM PLIERS", desc: "Grips tight and refuses to let go, like an old argument.", icon: ICON_PLIERS },
    { id: "flashlight", name: "THE FLICKERING FLASHLIGHT", desc: "Reveals what's hiding, right before the battery gives up.", icon: ICON_FLASHLIGHT },
    { id: "rope", name: "THE TANGLED ROPE", desc: "Always exactly the length you need, once untangled.", icon: ICON_ROPE },
    { id: "anchor", name: "THE HEAVY ANCHOR", desc: "Keeps you grounded. Occasionally too well.", icon: ICON_ANCHOR },
    { id: "quill", name: "THE INK QUILL", desc: "Writes contracts, letters, and the occasional regret.", icon: ICON_QUILL },
    { id: "hook", name: "THE PATIENT HOOK", desc: "Waits quietly for something bigger to bite.", icon: ICON_HOOK },
    { id: "bell", name: "THE LOUD BELL", desc: "Announces dinner, danger, and unwanted visitors.", icon: ICON_BELL },
    { id: "drill", name: "THE EAGER DRILL", desc: "Bores through walls, wood, and awkward pauses.", icon: ICON_DRILL },
    { id: "funnel", name: "THE NARROW FUNNEL", desc: "Turns a mess into a slightly smaller mess.", icon: ICON_FUNNEL },
    { id: "spool", name: "THE LAST THREAD", desc: "Just enough left to fix one more thing.", icon: ICON_SPOOL },
    { id: "chisel", name: "THE STEADY CHISEL", desc: "Shapes stone one stubborn tap at a time.", icon: ICON_CHISEL },
    { id: "level", name: "THE HONEST LEVEL", desc: "Never lies about what's crooked.", icon: ICON_LEVEL },
    { id: "oilcan", name: "THE SQUEAKY OIL CAN", desc: "Silences hinges, gears, and creaky opinions.", icon: ICON_OILCAN },
    { id: "horseshoe", name: "THE LUCKY HORSESHOE", desc: "Worked for the horse. Might work for you.", icon: ICON_HORSESHOE },
    { id: "spatula", name: "THE FLIPPING SPATULA", desc: "Flawless flips, occasional casualties.", icon: ICON_SPATULA },
    { id: "needle", name: "THE SHARP NEEDLE", desc: "Mends torn seams and pierces bad excuses.", icon: ICON_NEEDLE },
    { id: "glue", name: "THE STICKY GLUE", desc: "Fixes everything except the thing you actually broke.", icon: ICON_GLUE },
    { id: "whistle", name: "THE TIN WHISTLE", desc: "One sharp note ends any argument.", icon: ICON_WHISTLE }
  ];

  const TOOLS_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

  // ---- lock types (each chest rolls one) + matching keys (won as rewards) ----

  const LOCK_PADLOCK = `<path d="M132,100 a18,18 0 0 1 36,0 v16 h-13 v-16 a5.5,5.5 0 0 0 -10,0 v16 h-13 z" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><rect x="125" y="101" width="50" height="42" rx="8" fill="var(--lock-accent)" stroke="var(--ink)" stroke-width="7"/><circle cx="150" cy="117" r="6" fill="var(--ink)"/><rect x="147" y="121" width="6" height="13" fill="var(--ink)"/>`;
  const LOCK_CHAIN = `<g fill="none" stroke="var(--ink)" stroke-width="6"><ellipse cx="118" cy="106" rx="15" ry="10" transform="rotate(38 118 106)"/><ellipse cx="138" cy="118" rx="15" ry="10" transform="rotate(38 138 118)"/><ellipse cx="158" cy="130" rx="15" ry="10" transform="rotate(38 158 130)"/><ellipse cx="182" cy="106" rx="15" ry="10" transform="rotate(-38 182 106)"/><ellipse cx="162" cy="118" rx="15" ry="10" transform="rotate(-38 162 118)"/><ellipse cx="142" cy="130" rx="15" ry="10" transform="rotate(-38 142 130)"/></g><circle cx="150" cy="118" r="15" fill="var(--lock-accent)" stroke="var(--ink)" stroke-width="7"/><circle cx="150" cy="118" r="4" fill="var(--ink)"/>`;
  const LOCK_DIAL = `<rect x="118" y="97" width="64" height="48" rx="9" fill="var(--lock-accent)" stroke="var(--ink)" stroke-width="7"/><circle cx="150" cy="122" r="18" fill="var(--paper)" stroke="var(--ink)" stroke-width="6"/><circle cx="150" cy="122" r="3" fill="var(--ink)"/><line x1="150" y1="122" x2="150" y2="108" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="104" r="3" fill="var(--ink)"/>`;
  const LOCK_BOLT = `<rect x="108" y="104" width="84" height="28" rx="6" fill="var(--lock-accent)" stroke="var(--ink)" stroke-width="7"/><rect x="116" y="111" width="68" height="14" rx="4" fill="var(--gold-dark)" stroke="var(--ink)" stroke-width="4"/><circle cx="124" cy="118" r="4.5" fill="var(--ink)"/><circle cx="176" cy="118" r="4.5" fill="var(--ink)"/><rect x="138" y="130" width="24" height="16" rx="4" fill="var(--lock-accent)" stroke="var(--ink)" stroke-width="6"/>`;

  const LOCK_TYPES = [
    { id: "padlock", name: "PADLOCK", svg: LOCK_PADLOCK },
    { id: "chain", name: "CHAIN LOCK", svg: LOCK_CHAIN },
    { id: "dial", name: "DIAL LOCK", svg: LOCK_DIAL },
    { id: "bolt", name: "BOLT LOCK", svg: LOCK_BOLT }
  ];

  const ICON_SKELETON_KEY = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="28" r="14"/><line x1="38" y1="38" x2="80" y2="80"/><line x1="66" y1="66" x2="78" y2="54"/><line x1="74" y1="74" x2="86" y2="62"/></g></svg>`;
  const ICON_BOLT_CUTTERS = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M50 50 L18 20 M50 50 L18 80 M50 50 L82 20 M50 50 L82 80"/><circle cx="50" cy="50" r="9"/></g></svg>`;
  const ICON_CODE_CARD = `<svg viewBox="0 0 100 100"><g stroke="var(--ink)" stroke-width="6" stroke-linejoin="round"><rect x="18" y="26" width="64" height="48" rx="6" fill="var(--paper)"/><circle cx="34" cy="42" r="4" fill="var(--ink)" stroke="none"/><circle cx="50" cy="42" r="4" fill="var(--ink)" stroke="none"/><circle cx="66" cy="42" r="4" fill="var(--ink)" stroke="none"/><line x1="30" y1="58" x2="70" y2="58" stroke-width="5" stroke-linecap="round"/></g></svg>`;
  const ICON_CRANK = `<svg viewBox="0 0 100 100"><g fill="var(--paper)" stroke="var(--ink)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><rect x="44" y="14" width="12" height="50" rx="4"/><circle cx="50" cy="72" r="16"/><rect x="20" y="66" width="16" height="12" rx="3"/><rect x="64" y="66" width="16" height="12" rx="3"/></g></svg>`;

  const KEYS = [
    { id: "padlock", name: "SKELETON KEY", desc: "Slides into any padlock like it was carved for it. Unlocks padlocked chests fast.", icon: ICON_SKELETON_KEY },
    { id: "chain", name: "BOLT CUTTERS", desc: "Snips through chain links in one crunch. Unlocks chain-locked chests fast.", icon: ICON_BOLT_CUTTERS },
    { id: "dial", name: "CODE CARD", desc: "Someone wrote the combination on the back. Unlocks dial-locked chests fast.", icon: ICON_CODE_CARD },
    { id: "bolt", name: "IRON CRANK", desc: "Cranks even the heaviest deadbolt open. Unlocks bolt-locked chests fast.", icon: ICON_CRANK }
  ];

  function applyLockType(lock) {
    lockShapeWrap.innerHTML = lock.svg;
  }

  // ---- workshop recipes (combine two tools into a crafted one) ----

  function craftIcon(iconA, iconB) {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><svg x="-6" y="-6" width="60" height="60">${iconA}</svg><svg x="46" y="46" width="60" height="60">${iconB}</svg><circle cx="50" cy="50" r="11" fill="var(--spark)" stroke="var(--ink)" stroke-width="4"/><path d="M50 44 V56 M44 50 H56" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/></svg>`;
  }

  const RECIPE_DEFS = [
    { a: "hammer", b: "nail", id: "carpentersFist", name: "THE CARPENTER'S FIST", desc: "Drives its own nails in. Efficient, mildly unsettling." },
    { a: "wrench", b: "gear", id: "clockworkWrench", name: "THE CLOCKWORK WRENCH", desc: "Turns bolts and time itself, though mostly just bolts." },
    { a: "saw", b: "axe", id: "lumberjacksEdge", name: "THE LUMBERJACK'S EDGE", desc: "Two ways to cut, one way to regret standing nearby." },
    { a: "rope", b: "hook", id: "grapplingRig", name: "THE GRAPPLING RIG", desc: "Catches ledges, buckets, and the occasional bad idea." },
    { a: "key", b: "magnet", id: "keyringMagnet", name: "THE KEYRING MAGNET", desc: "Finds every dropped key in the room. Yours and everyone else's." },
    { a: "flashlight", b: "compass", id: "explorersLantern", name: "THE EXPLORER'S LANTERN", desc: "Lights the way and points toward it. Redundant, reassuring." },
    { a: "needle", b: "spool", id: "mendingKit", name: "THE MENDING KIT", desc: "Stitches torn seams before you've noticed the tear." },
    { a: "glue", b: "paintbrush", id: "restorersBrush", name: "THE RESTORER'S BRUSH", desc: "Fixes the crack, then paints over the evidence." },
    { a: "bucket", b: "funnel", id: "alchemistsPot", name: "THE ALCHEMIST'S POT", desc: "Turns a mess into a slightly smaller, slightly greener mess." },
    { a: "chisel", b: "level", id: "masonsSet", name: "THE MASON'S SET", desc: "Shapes stone straight, or at least straight enough." }
  ];

  const RECIPES = RECIPE_DEFS.map((r) => ({
    ...r,
    icon: craftIcon(TOOLS_BY_ID[r.a].icon, TOOLS_BY_ID[r.b].icon)
  }));

  function findRecipe(idA, idB) {
    return RECIPES.find((r) => (r.a === idA && r.b === idB) || (r.a === idB && r.b === idA));
  }

  const CHEST_THEMES = [
    { light: "oklch(80% 0.13 78)",  mid: "oklch(68% 0.15 66)",  dark: "oklch(54% 0.13 55)",  wood: "oklch(42% 0.08 40)",  spark: "oklch(88% 0.17 95)"  }, // golden oak
    { light: "oklch(78% 0.13 165)", mid: "oklch(64% 0.14 160)", dark: "oklch(50% 0.13 155)", wood: "oklch(38% 0.08 150)", spark: "oklch(90% 0.14 150)" }, // jade
    { light: "oklch(78% 0.12 300)", mid: "oklch(63% 0.15 295)", dark: "oklch(49% 0.14 290)", wood: "oklch(38% 0.09 285)", spark: "oklch(90% 0.11 300)" }, // royal violet
    { light: "oklch(76% 0.14 25)",  mid: "oklch(60% 0.19 24)",  dark: "oklch(47% 0.17 22)",  wood: "oklch(36% 0.10 20)", spark: "oklch(90% 0.15 60)"  }, // crimson vault
    { light: "oklch(82% 0.04 235)", mid: "oklch(68% 0.06 232)", dark: "oklch(54% 0.06 228)", wood: "oklch(40% 0.05 224)", spark: "oklch(92% 0.08 220)" }, // arctic steel
    { light: "oklch(78% 0.13 50)",  mid: "oklch(63% 0.16 45)",  dark: "oklch(49% 0.15 40)",  wood: "oklch(37% 0.09 35)", spark: "oklch(90% 0.13 70)"  }  // copper sunset
  ];

  function applyChestTheme(theme) {
    chestSvg.style.setProperty("--gold-light", theme.light);
    chestSvg.style.setProperty("--gold", theme.mid);
    chestSvg.style.setProperty("--gold-dark", theme.dark);
    chestSvg.style.setProperty("--wood", theme.wood);
    chestSvg.style.setProperty("--spark", theme.spark);
  }

  const ROUNDED_BODY = "M50,112 H250 A16,16 0 0 1 266,128 V192 A16,16 0 0 1 250,208 H50 A16,16 0 0 1 34,192 V128 A16,16 0 0 1 50,112 Z";

  const CHEST_SHAPES = [
    { // classic dome
      body: ROUNDED_BODY,
      lid: `<path d="M34,112 Q34,32 150,28 Q266,32 266,112 Z" fill="var(--gold-light)" stroke="var(--ink)" stroke-width="8" stroke-linejoin="round"/>`
    },
    { // pot-bellied barrel with a knob handle
      body: "M34,112 L266,112 C284,112 284,138 284,160 C284,190 272,208 250,208 L50,208 C28,208 16,190 16,160 C16,138 16,112 34,112 Z",
      lid: `<path d="M34,112 L34,84 Q34,62 58,58 L242,58 Q266,62 266,84 L266,112 Z" fill="var(--gold-light)" stroke="var(--ink)" stroke-width="8" stroke-linejoin="round"/><circle cx="150" cy="56" r="12" fill="var(--gold-dark)" stroke="var(--ink)" stroke-width="6"/>`
    },
    { // flat brutalist vault
      body: "M38,112 H262 A4,4 0 0 1 266,116 V204 A4,4 0 0 1 262,208 H38 A4,4 0 0 1 34,204 V116 A4,4 0 0 1 38,112 Z",
      lid: `<path d="M36,112 V70 A4,4 0 0 1 40,66 H260 A4,4 0 0 1 264,70 V112 Z" fill="var(--gold-light)" stroke="var(--ink)" stroke-width="8" stroke-linejoin="round"/><rect x="118" y="80" width="64" height="14" rx="3" fill="var(--gold-dark)" stroke="var(--ink)" stroke-width="5"/>`
    },
    { // gabled pirate peak
      body: ROUNDED_BODY,
      lid: `<path d="M34,112 L34,92 Q34,82 44,76 L130,36 Q150,26 170,36 L256,76 Q266,82 266,92 L266,112 Z" fill="var(--gold-light)" stroke="var(--ink)" stroke-width="8" stroke-linejoin="round"/>`
    }
  ];

  function applyChestShape(shape) {
    bodyShape.setAttribute("d", shape.body);
    lidShapeWrap.innerHTML = shape.lid;
  }

  let requiredHits = 0;
  let hits = 0;
  let opened = false;
  let currentLock = null;
  let currentHasKey = false;
  let audioCtx = null;
  let workshopSelection = [];

  // ---- unlocked rewards (persisted) ----
  function loadSet(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveSet(storageKey, set) {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...set]));
    } catch (e) { /* ignore */ }
  }

  function loadCounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FOUND_COUNTS);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function saveCounts(counts) {
    try {
      localStorage.setItem(STORAGE_KEY_FOUND_COUNTS, JSON.stringify(counts));
    } catch (e) { /* ignore */ }
  }

  let unlockedTools = loadSet(STORAGE_KEY_TOOLS);
  let unlockedKeys = loadSet(STORAGE_KEY_KEYS);
  let unlockedCrafted = loadSet(STORAGE_KEY_CRAFTED);
  let foundCounts = loadCounts();

  function renderRow(list, listEl, isUnlockedFn) {
    listEl.innerHTML = "";
    list.forEach((item) => {
      const isUnlocked = isUnlockedFn(item.id);
      const li = document.createElement("li");
      li.className = "tool-row" + (isUnlocked ? "" : " locked");

      const badge = document.createElement("div");
      badge.className = "tool-row-badge";
      badge.innerHTML = isUnlocked ? item.icon : ICON_LOCK;

      const name = document.createElement("span");
      name.className = "tool-row-name";
      name.textContent = isUnlocked ? item.name : "???";

      li.appendChild(badge);
      li.appendChild(name);
      listEl.appendChild(li);
    });
  }

  function renderCollection() {
    toolsSubtitle.textContent = `TOOLS FOUND ${unlockedTools.size}/${TOOLS.length}`;
    craftedSubtitle.textContent = `WORKSHOP FINDS ${unlockedCrafted.size}/${RECIPES.length}`;
    keysSubtitle.textContent = `KEYS FOUND ${unlockedKeys.size}/${KEYS.length}`;
    renderRow(TOOLS, toolList, (id) => unlockedTools.has(id));
    renderRow(RECIPES, craftedList, (id) => unlockedCrafted.has(id));
    renderRow(KEYS, keyList, (id) => unlockedKeys.has(id));
  }

  function openMenu() {
    renderCollection();
    menuScrim.classList.add("open");
    menuDrawer.classList.add("open");
    menuDrawer.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    menuScrim.classList.remove("open");
    menuDrawer.classList.remove("open");
    menuDrawer.setAttribute("aria-hidden", "true");
  }

  // ---- audio ----
  function initAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function beep(freq, dur, type, vol, delay = 0) {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function playHitSound() {
    beep(150 + hits * 10, 0.07, "square", 0.05);
  }

  function playOpenSound() {
    [523.25, 659.25, 784.0, 1046.5].forEach((f, i) => beep(f, 0.16, "triangle", 0.06, i * 0.09));
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
    }
  }

  // ---- particles ----
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  function spawnChips(cx, cy) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const chip = document.createElement("div");
      chip.className = "chip";
      const angle = rand(0, Math.PI * 2);
      const dist = rand(30, 70);
      chip.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      chip.style.setProperty("--ty", `${Math.sin(angle) * dist - 10}px`);
      chip.style.setProperty("--rot", `${rand(-180, 180)}deg`);
      chip.style.setProperty("--size", `${rand(8, 14)}px`);
      chip.style.setProperty("--bg", Math.random() > 0.5 ? "var(--gold-dark)" : "var(--coral)");
      chip.style.setProperty("--rad", Math.random() > 0.5 ? "3px" : "50%");
      chip.style.left = `${cx}px`;
      chip.style.top = `${cy}px`;
      fxLayer.appendChild(chip);
      chip.addEventListener("animationend", () => chip.remove());
    }
  }

  function spawnCoins() {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const coin = document.createElement("div");
      coin.className = "coin";
      const angle = rand(-2.5, -0.6);
      const dist = rand(90, 200);
      coin.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      coin.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      coin.style.setProperty("--rot", `${rand(90, 320)}deg`);
      const size = rand(14, 24);
      coin.style.setProperty("--size", `${size}px`);
      const isGem = Math.random() > 0.6;
      coin.style.setProperty("--bg", isGem ? "var(--spark)" : "var(--gold)");
      coin.style.setProperty("--rad", isGem ? "3px" : "50%");
      if (isGem) coin.style.transform = "translate(-50%,-50%) rotate(45deg)";
      coin.style.animationDelay = `${i * 0.03}s`;
      fxLayer.appendChild(coin);
      coin.addEventListener("animationend", () => coin.remove());
    }
  }

  function spawnWord() {
    const word = document.createElement("span");
    word.className = "pop-word";
    word.textContent = HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)];
    word.style.color = WORD_COLORS[Math.floor(Math.random() * WORD_COLORS.length)];
    word.style.setProperty("--rot", `${rand(-14, 14)}deg`);
    const stageRect = stage.getBoundingClientRect();
    const chestRect = chestBtn.getBoundingClientRect();
    const originX = chestRect.left - stageRect.left + chestRect.width * rand(0.55, 0.9);
    const originY = chestRect.top - stageRect.top + chestRect.height * rand(0.05, 0.3);
    word.style.left = `${originX}px`;
    word.style.top = `${originY}px`;
    fxLayer.appendChild(word);
    word.addEventListener("animationend", () => word.remove());
  }

  function spawnBigWord(text) {
    const word = document.createElement("span");
    word.className = "pop-word big";
    word.textContent = text;
    word.style.color = "var(--coral)";
    word.style.setProperty("--rot", `${rand(-6, 6)}deg`);
    const stageRect = stage.getBoundingClientRect();
    word.style.left = `${stageRect.width / 2}px`;
    word.style.top = `${stageRect.height * 0.32}px`;
    fxLayer.appendChild(word);
    word.addEventListener("animationend", () => word.remove());
  }

  function spawnPuffs() {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const puff = document.createElement("div");
      puff.className = "puff";
      const angle = rand(0, Math.PI * 2);
      const dist = rand(40, 90);
      puff.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      puff.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      puff.style.setProperty("--size", `${rand(14, 24)}px`);
      puff.style.animationDelay = `${i * 0.02}s`;
      fxLayer.appendChild(puff);
      puff.addEventListener("animationend", () => puff.remove());
    }
  }

  function spawnConfetti() {
    const colors = ["var(--coral)", "var(--gold)", "var(--spark)", "var(--gold-dark)"];
    const count = 16;
    const stageRect = stage.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = `${rand(0, stageRect.width)}px`;
      piece.style.setProperty("--tx", `${rand(-60, 60)}px`);
      piece.style.setProperty("--rot", `${rand(180, 540)}deg`);
      piece.style.setProperty("--bg", colors[randInt(0, colors.length - 1)]);
      piece.style.animationDelay = `${rand(0, 0.3)}s`;
      fxLayer.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  function triggerShockwave() {
    shockwave.classList.remove("burst");
    void shockwave.offsetWidth;
    shockwave.classList.add("burst");
  }

  // ---- game flow ----
  function updateHint() {
    const ratio = hits / requiredHits;
    if (hits === 0) hintText.textContent = currentHasKey ? "YOU HAVE THE KEY!" : "TAP THE CHEST";
    else if (ratio < 0.45) hintText.textContent = "KEEP GOING!";
    else if (ratio < 0.8) hintText.textContent = "IT'S CRACKING!";
    else hintText.textContent = "ONE MORE HIT!";
  }

  function revealCracks() {
    const ratio = hits / requiredHits;
    if (ratio >= 0.35) document.getElementById("crack1").classList.add("show");
    if (ratio >= 0.65) document.getElementById("crack2").classList.add("show");
    if (ratio >= 0.85) document.getElementById("crack3").classList.add("show");
  }

  function wobbleChest() {
    chestSvg.classList.remove("hit");
    void chestSvg.offsetWidth;
    chestSvg.classList.add("hit");
  }

  function shakeStage() {
    stage.classList.remove("shake");
    void stage.offsetWidth;
    stage.classList.add("shake");
  }

  function hitChest(e) {
    if (opened) return;
    initAudio();

    hits++;
    updateHint();
    revealCracks();
    wobbleChest();
    shakeStage();
    spawnWord();

    const stageRect = stage.getBoundingClientRect();
    const cx = (e.clientX && e.detail !== 0) ? e.clientX - stageRect.left : stageRect.width / 2;
    const cy = (e.clientY && e.detail !== 0) ? e.clientY - stageRect.top : stageRect.height / 2;
    spawnChips(cx, cy);

    playHitSound();
    vibrate(15);

    if (hits >= requiredHits) openChest();
  }

  function openChest() {
    opened = true;
    chestBtn.disabled = true;
    hintText.textContent = "IT'S OPEN!";
    stage.classList.add("chest-opened");
    shakeStage();

    chestSvg.classList.remove("hit");
    void chestSvg.offsetWidth;
    chestSvg.classList.add("pop");

    rays.classList.remove("burst");
    void rays.offsetWidth;
    rays.classList.add("burst");

    triggerShockwave();
    spawnBigWord("OPEN!");
    spawnConfetti();

    playOpenSound();
    vibrate([20, 40, 20, 40, 60]);

    setTimeout(() => {
      spawnCoins();
      spawnPuffs();
    }, 150);

    setTimeout(showRewardSheet, 1000);
  }

  function pickReward() {
    const missingKeys = KEYS.filter((k) => !unlockedKeys.has(k.id));
    const wantKey = !currentHasKey && Math.random() < 0.35;
    if (wantKey) {
      const pool = missingKeys.length ? missingKeys : KEYS;
      return { kind: "key", item: pool[randInt(0, pool.length - 1)] };
    }
    return { kind: "tool", item: TOOLS[randInt(0, TOOLS.length - 1)] };
  }

  function showRewardSheet() {
    const reward = pickReward();
    const item = reward.item;
    toolBadge.innerHTML = item.icon;
    toolNameEl.textContent = item.name;
    toolDescEl.textContent = item.desc;

    foundCounts[item.id] = (foundCounts[item.id] || 0) + 1;
    saveCounts(foundCounts);
    toolCountBadge.textContent = `×${foundCounts[item.id]}`;
    toolCountBadge.hidden = foundCounts[item.id] <= 1;

    if (reward.kind === "key") {
      sheetKicker.textContent = "CHEST OPENED";
      sheetTitle.innerHTML = "KEY<br>FOUND!";
      unlockedKeys.add(item.id);
      saveSet(STORAGE_KEY_KEYS, unlockedKeys);
    } else {
      sheetKicker.textContent = "CHEST OPENED";
      sheetTitle.innerHTML = "TOOL<br>UNLOCKED!";
      unlockedTools.add(item.id);
      saveSet(STORAGE_KEY_TOOLS, unlockedTools);
    }

    scrim.classList.add("open");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
  }

  function hideRewardSheet() {
    scrim.classList.remove("open");
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
  }

  let lastThemeIndex = -1;
  let lastShapeIndex = -1;
  let lastLockIndex = -1;

  function pickRandomIndex(length, lastIndex) {
    let index = randInt(0, length - 1);
    if (length > 1 && index === lastIndex) {
      index = (index + 1) % length;
    }
    return index;
  }

  function pickChestTheme() {
    lastThemeIndex = pickRandomIndex(CHEST_THEMES.length, lastThemeIndex);
    applyChestTheme(CHEST_THEMES[lastThemeIndex]);
  }

  function pickChestShape() {
    lastShapeIndex = pickRandomIndex(CHEST_SHAPES.length, lastShapeIndex);
    applyChestShape(CHEST_SHAPES[lastShapeIndex]);
  }

  function pickLockType() {
    lastLockIndex = pickRandomIndex(LOCK_TYPES.length, lastLockIndex);
    currentLock = LOCK_TYPES[lastLockIndex];
    applyLockType(currentLock);
  }

  function resetGame() {
    pickChestTheme();
    pickChestShape();
    pickLockType();

    currentHasKey = unlockedKeys.has(currentLock.id);
    chestSvg.style.setProperty("--lock-accent", currentHasKey ? "var(--key-ready)" : "var(--coral)");
    keyChip.textContent = `${currentLock.name} — KEY MATCH!`;
    keyChip.hidden = !currentHasKey;

    requiredHits = currentHasKey
      ? randInt(KEY_MATCH_MIN_HITS, KEY_MATCH_MAX_HITS)
      : randInt(MIN_HITS, MAX_HITS);
    hits = 0;
    opened = false;
    chestBtn.disabled = false;
    stage.classList.remove("chest-opened");
    rays.classList.remove("burst");
    shockwave.classList.remove("burst");
    chestSvg.classList.remove("pop");
    ["crack1", "crack2", "crack3"].forEach((id) => document.getElementById(id).classList.remove("show"));
    updateHint();
  }

  // ---- workshop ----
  function clearWorkshopResult() {
    workshopResult.hidden = true;
    workshopResult.textContent = "";
    workshopResult.classList.remove("success", "fail", "repeat");
  }

  function updateWorkshopHint() {
    if (workshopSelection.length === 0) workshopHint.textContent = "PICK TWO TOOLS TO COMBINE";
    else if (workshopSelection.length === 1) workshopHint.textContent = "PICK ONE MORE";
    else workshopHint.textContent = "READY TO COMBINE";
  }

  function renderWorkshopSlots() {
    [slotA, slotB].forEach((slotEl, i) => {
      const id = workshopSelection[i];
      if (id) {
        const tool = TOOLS_BY_ID[id];
        slotEl.innerHTML = tool.icon;
        slotEl.classList.add("filled");
        slotEl.setAttribute("aria-label", `${tool.name} — tap to remove`);
      } else {
        slotEl.innerHTML = "<span>+</span>";
        slotEl.classList.remove("filled");
        slotEl.setAttribute("aria-label", i === 0 ? "Ingredient slot A" : "Ingredient slot B");
      }
    });
    combineBtn.disabled = workshopSelection.length !== 2;
    updateWorkshopHint();
  }

  function renderWorkshopInventory() {
    const ownedTools = TOOLS.filter((t) => unlockedTools.has(t.id));
    if (!ownedTools.length) {
      workshopInventory.innerHTML = '<p class="workshop-empty">CRACK CHESTS TO FIND TOOLS FIRST</p>';
      return;
    }
    workshopInventory.innerHTML = "";
    ownedTools.forEach((tool) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "workshop-item" + (workshopSelection.includes(tool.id) ? " selected" : "");
      btn.innerHTML = tool.icon;
      btn.setAttribute("aria-label", tool.name);
      btn.addEventListener("click", () => toggleWorkshopSelection(tool.id));
      workshopInventory.appendChild(btn);
    });
  }

  function toggleWorkshopSelection(id) {
    const idx = workshopSelection.indexOf(id);
    if (idx !== -1) {
      workshopSelection.splice(idx, 1);
    } else if (workshopSelection.length < 2) {
      workshopSelection.push(id);
    } else {
      return;
    }
    clearWorkshopResult();
    renderWorkshopSlots();
    renderWorkshopInventory();
  }

  function removeWorkshopSlot(index) {
    if (workshopSelection[index] == null) return;
    workshopSelection.splice(index, 1);
    clearWorkshopResult();
    renderWorkshopSlots();
    renderWorkshopInventory();
  }

  function combineTools() {
    if (workshopSelection.length !== 2) return;
    const [idA, idB] = workshopSelection;
    const recipe = findRecipe(idA, idB);

    workshopResult.hidden = false;
    workshopResult.classList.remove("success", "fail", "repeat");

    if (!recipe) {
      workshopResult.textContent = "NOTHING HAPPENS...";
      workshopResult.classList.add("fail");
    } else if (unlockedCrafted.has(recipe.id)) {
      workshopResult.textContent = `ALREADY CRAFTED: ${recipe.name}`;
      workshopResult.classList.add("repeat");
    } else {
      unlockedCrafted.add(recipe.id);
      saveSet(STORAGE_KEY_CRAFTED, unlockedCrafted);
      workshopResult.textContent = `CRAFTED: ${recipe.name}!`;
      workshopResult.classList.add("success");
      vibrate([15, 30, 15]);
    }

    workshopSelection = [];
    renderWorkshopSlots();
    renderWorkshopInventory();
  }

  function switchTab(tab) {
    const toWorkshop = tab === "workshop";
    tabChestBtn.classList.toggle("active", !toWorkshop);
    tabChestBtn.setAttribute("aria-selected", String(!toWorkshop));
    tabWorkshopBtn.classList.toggle("active", toWorkshop);
    tabWorkshopBtn.setAttribute("aria-selected", String(toWorkshop));
    stage.hidden = toWorkshop;
    hintFooter.hidden = toWorkshop;
    workshopPanel.hidden = !toWorkshop;
    if (toWorkshop) {
      renderWorkshopSlots();
      renderWorkshopInventory();
    }
  }

  chestBtn.addEventListener("click", hitChest);
  continueBtn.addEventListener("click", () => { hideRewardSheet(); resetGame(); });
  scrim.addEventListener("click", () => { hideRewardSheet(); resetGame(); });

  menuBtn.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuScrim.addEventListener("click", closeMenu);

  tabChestBtn.addEventListener("click", () => switchTab("chest"));
  tabWorkshopBtn.addEventListener("click", () => switchTab("workshop"));
  slotA.addEventListener("click", () => removeWorkshopSlot(0));
  slotB.addEventListener("click", () => removeWorkshopSlot(1));
  combineBtn.addEventListener("click", combineTools);

  resetGame();
})();
