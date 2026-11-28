(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const lab = {
    mode: "structure",
    sample: "pure",
    speed: 1,
    paused: matchMedia("(prefers-reduced-motion: reduce)").matches,
    power: false,
    heating: false,
    heaterLevel: 0,
    strikes: 0,
    impact: 0,
    shift: 0,
    time: 0
  };
  const experiments = {
    structure: {
      heading: "Inside a metal",
      topic: "Structure and bonding",
      concept: "What holds a metal together?",
      explain: "A pure metal has a giant, regular lattice of positive metal ions. Outer electrons are delocalised and move throughout the structure. The strong electrostatic attraction between the ions and these electrons holds the metal together.",
      task: "Watch a positive ion and then an electron. Which particle stays near the same place?"
    },
    electricity: {
      heading: "Electrical conduction",
      topic: "Electricity",
      concept: "What carries the charge?",
      explain: "A potential difference causes the delocalised electrons to drift towards the positive terminal. They still move randomly, but their net movement carries charge through the metal. The positive ions vibrate around their lattice positions.",
      task: "Follow electrons from the negative terminal, through the metal and lamp, and into the positive terminal."
    },
    heat: {
      heading: "Thermal conduction",
      topic: "Heat",
      concept: "Which solid warms up faster?",
      explain: "In the metal, moving delocalised electrons collide with ions and transfer energy to them. In the ionic solid, energy passes directly between neighbouring ions as they vibrate around fixed positions. The ionic solid in this comparison transfers heat more slowly.",
      task: "Heat both samples. Watch for flashes where particles bump and compare the two right-end readings."
    },
    hammer: {
      heading: "Malleability and alloys",
      topic: "Hammer test",
      concept: "Which sample changes shape more?",
      explain: "",
      task: "Strike the pure metal once. Switch to the alloy and strike it once with the same force. Compare how far the top layer moves."
    }
  };
  const heat = new Float64Array(12);
  const ionicHeat = new Float64Array(heat.length);
  const heatNext = new Float64Array(heat.length);
  const firstStrike = { pure: null, alloy: null };
  const random = (max) => Math.random() * max;
  const limit = (value, min, max) => Math.min(max, Math.max(min, value));
  const left = 140;
  const right = 656;
  const top = 127;
  const bottom = 356;
  const middle = (top + bottom) / 2;
  // The return lead, supply and outgoing lead form one continuous path.
  const wirePoints = [[right - 5, middle], [711, middle], [711, 82], [89, 82], [89, middle], [left + 5, middle]];
  const wireSegments = wirePoints.slice(1).map(([endX, endY], index) => {
    const [x, y] = wirePoints[index];
    return { x, y, dx: endX - x, dy: endY - y, length: Math.hypot(endX - x, endY - y) };
  });
  const wireLength = wireSegments.reduce((length, part) => length + part.length, 0);
  const slipPlane = 218.5;
  const ionicOffset = 248;
  const swingTime = .72;
  const alloySites = new Set([3, 14, 19, 25, 31, 42]);
  const ions = Array.from({ length: 45 }, (_, index) => {
    const row = Math.floor(index / 9);
    return { row, x: 170 + (index % 9) * 55 + (row % 2) * 19, y: 151 + row * 45, phase: random(2 * Math.PI), frequency: 4.6 + random(1.6), mixed: alloySites.has(index), neighbour: index % 9 > 0 && alloySites.has(index - 1), variation: index % 2 === 0 ? 1 : -1, bump: 0, bumpX: 0, bumpY: 0 };
  });
  const ionicColumns = 12;
  const ionicIons = Array.from({ length: 5 * ionicColumns }, (_, index) => {
    const row = Math.floor(index / ionicColumns);
    const column = index % ionicColumns;
    const negative = (row + column) % 2 === 1;
    return { x: 163 + column * 42.75, y: 151 + ionicOffset + row * 45, row, column, negative, radius: negative ? 22 : 19 };
  });
  const electrons = Array.from({ length: 62 }, () => ({
    x: left + 7 + random(right - left - 14),
    y: top + 7 + random(bottom - top - 14),
    angle: random(2 * Math.PI),
    turn: .09 + random(.42),
    warmth: 0,
    wire: null,
    entryY: middle
  }));
  const canvas = byId("lattice");
  const ctx = canvas.getContext("2d");
  const modelAction = byId("action");
  const pauseButton = byId("pause");
  const readout = byId("readout");
  const status = byId("status");
  const measures = byId("measurements");
  const comparison = byId("comparison");

  const alloy = () => lab.sample === "alloy";
  const topLayerShift = () => Math.min(lab.strikes * (alloy() ? 5 : 53), alloy() ? 15 : 90);
  const degrees = (value) => Math.round(20 + 150 * value) + " °C";
  const modelDistance = (value) => Math.round(value) + " model units";
  function localHeat(x, values = heat) {
    const point = limit((x - left) / (right - left), 0, 1) * (values.length - 1);
    const low = Math.floor(point);
    return values[low] + (values[Math.min(low + 1, values.length - 1)] - values[low]) * (point - low);
  }
  function layerShift(y) {
    return lab.shift * limit((slipPlane + 5 - y) / 10, 0, 1);
  }

  function modelReadout() {
    switch (lab.mode) {
      case "electricity":
        return lab.power ? "Power on · net electron drift from − to +" : "Power off · random electron motion";
      case "heat":
        return lab.heating ? "Heating both left ends · compare the right ends" : "Heater off · compare how heat spreads in each solid";
      case "hammer":
        if (!lab.strikes) return "Strike the sample and watch the upper layers.";
        return alloy() ? "Large ions obstruct the sliding layer, so the alloy shifts only slightly." : "The upper layers slide across the lower layers. The electrons still bind them together.";
      default:
        return alloy() ? "Different-sized ions disrupt the layers. Electrons still move freely." : "Ions vibrate in place while electrons move through the lattice.";
    }
  }

  function renderMeasurements() {
    const labels = lab.mode === "heat" ? ["Metal · right end", "Ionic solid · right end"] : ["Hammer strikes", "Top-layer shift"];
    measures.hidden = !["heat", "hammer"].includes(lab.mode);
    if (measures.hidden) return;
    measures.replaceChildren(...labels.map((label) => {
      const card = document.createElement("div");
      card.className = "measure";
      const title = document.createElement("span");
      title.textContent = label;
      card.append(title, document.createElement("strong"));
      return card;
    }));
    updateMeasurements();
  }

  function updateMeasurements() {
    if (measures.hidden) return;
    const values = lab.mode === "heat" ? [degrees(heat.at(-1)), degrees(ionicHeat.at(-1))] :
      [String(lab.strikes), modelDistance(lab.shift)];
    [...measures.querySelectorAll("strong")].forEach((value, index) => {
      if (value.textContent !== values[index]) value.textContent = values[index];
    });
  }

  function renderState() {
    const experiment = experiments[lab.mode];
    document.querySelectorAll("[data-mode]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.mode === lab.mode));
    document.querySelectorAll("[data-sample]").forEach((button) => button.setAttribute("aria-pressed", button.dataset.sample === lab.sample));
    byId("model-heading").textContent = experiment.heading;
    byId("sample-badge").textContent = alloy() ? "Alloy" : "Pure metal";
    byId("alloy-key").hidden = !alloy();
    byId("ionic-key").hidden = lab.mode !== "heat";
    byId("topic").textContent = experiment.topic;
    byId("concept").textContent = experiment.concept;
    const structureExplanation = "An alloy contains atoms of different sizes that disrupt the regular layers. Delocalised electrons still move throughout the structure, and their electrostatic attraction to the positive ions holds it together.";
    byId("explain").textContent = lab.mode === "hammer"
      ? (alloy()
        ? "Different-sized atoms distort the regular layers. The layers slide less easily under the same blow, so the alloy is harder to deform."
        : "In a pure metal, the regular layers can slide over each other. Delocalised electrons remain between the layers, so their attraction to the positive ions still holds the metal together.")
      : lab.mode === "structure" && alloy() ? structureExplanation : experiment.explain;
    byId("task").textContent = experiment.task;
    byId("task-title").textContent = lab.mode === "hammer" ? "Compare the two samples" : "Try this";
    readout.textContent = modelReadout();
    byId("stage-description").textContent = lab.mode === "heat"
      ? "The metal is shown above the ionic solid. Both are heated at the left. The ionic solid contains alternating positive and negative ions that pass energy along as they vibrate."
      : [alloy() ? "Different-sized positive ions distort the lattice." : "Positive metal ions vibrate around their lattice positions.", modelReadout()].join(" ");
    const engaged = lab.power || lab.heating;
    const labels = { structure: "Random motion", electricity: lab.power ? "Power on" : "Power off", heat: lab.heating ? "Heating both samples" : "Heater off", hammer: lab.strikes ? "Sample struck" : "Ready to strike" };
    status.textContent = lab.paused ? "Motion paused" : labels[lab.mode];
    status.classList.toggle("active", !lab.paused && (engaged || lab.strikes > 0));
    modelAction.hidden = lab.mode === "structure";
    modelAction.textContent = { structure: "", electricity: lab.power ? "Switch power off" : "Switch power on", heat: lab.heating ? "Turn heater off" : "Heat both left ends", hammer: "Hit with hammer" }[lab.mode];
    modelAction.classList.toggle("engaged", engaged);
    if (lab.mode === "electricity" || lab.mode === "heat") modelAction.setAttribute("aria-pressed", engaged);
    else modelAction.removeAttribute("aria-pressed");
    pauseButton.textContent = lab.paused ? "Resume motion" : "Pause motion";
    pauseButton.setAttribute("aria-pressed", lab.paused);
    comparison.hidden = lab.mode !== "hammer";
    if (!comparison.hidden) {
      for (const [sample, distance] of Object.entries(firstStrike)) {
        byId(sample + "-result").textContent = distance === null ? "Awaiting strike" : modelDistance(distance);
      }
    }
    renderMeasurements();
    resizeCanvas();
  }

  function resetTrial({ clearComparison = false } = {}) {
    lab.power = false;
    lab.heating = false;
    lab.heaterLevel = 0;
    lab.strikes = 0;
    lab.shift = 0;
    lab.impact = 0;
    heat.fill(0);
    ionicHeat.fill(0);
    ions.forEach((ion) => { ion.bump = 0; });
    electrons.forEach((electron, index) => {
      electron.warmth = 0;
      electron.wire = lab.mode === "electricity" && index < 18 ? (index + .5) * wireLength / 18 : null;
      electron.entryY = middle;
    });
    if (clearComparison) firstStrike.pure = firstStrike.alloy = null;
  }

  byId("experiments").addEventListener("click", (event) => {
    const mode = event.target.closest("[data-mode]")?.dataset.mode;
    if (!mode || lab.mode === mode) return;
    lab.mode = mode;
    resetTrial({ clearComparison: true });
    renderState();
  });
  byId("samples").addEventListener("click", (event) => {
    const sample = event.target.closest("[data-sample]")?.dataset.sample;
    if (!sample || lab.sample === sample) return;
    lab.sample = sample;
    resetTrial();
    renderState();
  });
  byId("reset").addEventListener("click", () => {
    resetTrial({ clearComparison: true });
    renderState();
  });
  byId("speed").addEventListener("input", (event) => {
    lab.speed = Number(event.target.value);
    byId("speed-value").textContent = lab.speed + "×";
  });
  pauseButton.addEventListener("click", () => {
    lab.paused = !lab.paused;
    if (lab.paused && lab.mode === "hammer") {
      lab.impact = 0;
      lab.shift = topLayerShift();
    }
    renderState();
  });
  modelAction.addEventListener("click", () => {
    if (lab.mode === "electricity") lab.power = !lab.power;
    if (lab.mode === "heat") lab.heating = !lab.heating;
    if (lab.mode === "hammer") {
      if (lab.impact > 0) return;
      lab.strikes++;
      if (lab.strikes === 1) firstStrike[lab.sample] = topLayerShift();
      if (lab.paused) lab.shift = topLayerShift();
      else lab.impact = swingTime;
    }
    renderState();
  });

  function simulate(dt) {
    lab.time += dt;
    let hotIons = null;
    if (lab.mode === "heat") {
      const rate = lab.heating ? 2 : 5;
      lab.heaterLevel += (Number(lab.heating) - lab.heaterLevel) * (1 - Math.exp(-dt * rate));
      diffuseHeat(heat, 10, dt);
      diffuseHeat(ionicHeat, 2.8, dt);
      hotIons = ions.map((ion) => {
        ion.bump = Math.max(0, ion.bump - dt);
        return { ion, ...metalIonPosition(ion) };
      });
    }
    if (lab.impact > 0) lab.impact = Math.max(0, lab.impact - dt);
    if (lab.impact < .4) {
      const recoil = alloy() ? 12 * Math.sin(Math.PI * lab.impact / .4) : 0;
      lab.shift += (topLayerShift() + recoil - lab.shift) * (1 - Math.exp(-dt * 15));
    }
    for (const electron of electrons) {
      if (electron.wire !== null) {
        if (lab.power) advanceThroughWire(electron, dt);
        continue;
      }
      electron.turn -= dt;
      if (electron.turn <= 0) {
        electron.angle += random(2.1) - 1.05;
        electron.turn = .12 + random(.36);
      }
      // The tint and speed follow the electron as it moves through the temperature gradient.
      electron.warmth += (localHeat(electron.x) - electron.warmth) * (1 - Math.exp(-dt * 5));
      const velocity = 38 + electron.warmth * 132;
      const drift = lab.power ? 96 : 0;
      electron.x += (Math.cos(electron.angle) * velocity + drift) * dt;
      electron.y += Math.sin(electron.angle) * velocity * dt;
      if (lab.power) {
        const funnel = limit((electron.x - right + 121) / 116, 0, 1);
        electron.y += (middle - electron.y) * funnel * 5 * dt;
      }
      if (electron.y < top + 5 || electron.y > bottom - 5) {
        electron.y = limit(electron.y, top + 5, bottom - 5);
        electron.angle *= -1;
      }
      if (lab.power && electron.x >= right - 5) {
        if (Math.abs(electron.y - middle) < 9) {
          electron.wire = electron.x - (right - 5);
          electron.entryY = electron.y;
        }
        electron.x = right - 5;
      } else if (electron.x < left + 5 || electron.x > right - 5) {
        electron.x = limit(electron.x, left + 5, right - 5);
        electron.angle = Math.PI - electron.angle;
      }
      if (hotIons) collideWithMetalIon(electron, hotIons);
    }
  }

  function advanceThroughWire(electron, dt) {
    electron.wire += 122 * dt;
    if (electron.wire < wireLength) return;
    electron.x = left + 5 + electron.wire - wireLength;
    electron.y = middle;
    electron.angle = (random(1) - .5) * 1.3;
    electron.wire = null;
  }

  function collideWithMetalIon(electron, sites) {
    const vx = Math.cos(electron.angle);
    const vy = Math.sin(electron.angle);
    for (const { ion, x, y, radius, warmth } of sites) {
      const dx = electron.x - x;
      const dy = electron.y - y;
      const contact = radius + 4;
      const inward = vx * dx + vy * dy;
      if (Math.abs(dx) >= contact || Math.abs(dy) >= contact || inward >= 0 || dx * dx + dy * dy >= contact * contact) continue;
      const distance = Math.hypot(dx, dy);
      const nx = dx / distance;
      const ny = dy / distance;
      const approach = vx * nx + vy * ny;
      electron.x = limit(x + nx * contact, left + 5, right - 5);
      electron.y = limit(y + ny * contact, top + 5, bottom - 5);
      electron.angle = Math.atan2(vy - 2 * approach * ny, vx - 2 * approach * nx);
      if (electron.warmth > .17 && electron.warmth > warmth && ion.bump <= .12) {
        const transfer = Math.max(.04, (electron.warmth - warmth) * .35);
        electron.warmth -= transfer;
        ion.bump = .32;
        ion.bumpX = -nx;
        ion.bumpY = -ny;
      }
      break;
    }
  }

  function diffuseHeat(values, diffusivity, dt) {
    for (let i = 0; i < values.length; i++) {
      const before = values[Math.max(0, i - 1)];
      const after = values[Math.min(values.length - 1, i + 1)];
      const source = i === 0 ? lab.heaterLevel * (1 - values[i]) * 15 : 0;
      const transfer = diffusivity * (before + after - 2 * values[i]);
      const cooling = .06 + (1 - lab.heaterLevel) * .35;
      heatNext[i] = limit(values[i] + dt * (transfer + source - values[i] * cooling), 0, 1);
    }
    values.set(heatNext);
  }

  function circle(x, y, radius, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }

  function line(points, colour, width = 2) {
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function roundedBox(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  }

  function label(value, x, y, colour = "#c3d7e8", size = 15, align = "left", weight = 650) {
    ctx.font = weight + " " + size + "px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillStyle = colour;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(value, x, y);
  }

  function arrow(x1, x2, y, colour) {
    const direction = Math.sign(x2 - x1);
    line([[x1, y], [x2, y]], colour, 2.2);
    line([[x2 - 8 * direction, y - 5], [x2, y], [x2 - 8 * direction, y + 5]], colour, 2.2);
  }

  function drawBackground(height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#172b3c");
    gradient.addColorStop(1, "#101d2b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, height);
    ctx.fillStyle = "#9ec1db22";
    for (let y = 16; y < height; y += 21) {
      for (let x = 16; x < 800; x += 21) ctx.fillRect(x, y, 1.1, 1.1);
    }
  }

  function drawElectron(x, y, colour) {
    circle(x, y, 5.3, colour);
    line([[x - 2.4, y], [x + 2.4, y]], "#203d51", 1.2);
  }

  function wirePosition(electron) {
    let distance = electron.wire;
    for (const [index, segment] of wireSegments.entries()) {
      if (distance <= segment.length) {
        const progress = distance / segment.length;
        const entryOffset = index === 0 ? (electron.entryY - middle) * (1 - progress) : 0;
        return [segment.x + segment.dx * progress, segment.y + segment.dy * progress + entryOffset];
      }
      distance -= segment.length;
    }
    return [left + 5, middle];
  }

  function drawCircuit() {
    const wireColour = lab.power ? "#6597b4" : "#587184";
    const lampX = 575;
    const lampY = 82;
    if (lab.power) {
      const glow = ctx.createRadialGradient(lampX, lampY, 8, lampX, lampY, 55);
      glow.addColorStop(0, "#ffc85e91");
      glow.addColorStop(1, "#ffc85e00");
      circle(lampX, lampY, 55, glow);
    }
    line(wirePoints, wireColour, 4);
    circle(lampX, lampY, 19, lab.power ? "#ffe396" : "#213647", lab.power ? "#fff0ba" : "#8fa9bb");
    const filament = lab.power ? "#925914" : "#9caeba";
    line([[lampX - 18, lampY], [lampX - 9, lampY], [lampX + 9, lampY], [lampX + 18, lampY]], filament, 2);
    line([[lampX - 9, lampY + 9], [lampX + 9, lampY - 9]], filament, 2);
    line([[lampX - 9, lampY - 9], [lampX + 9, lampY + 9]], filament, 2);
    for (const electron of electrons) {
      if (electron.wire === null) continue;
      const [x, y] = wirePosition(electron);
      drawElectron(x, y, lab.power ? "#a6ebff" : "#87bada");
    }
    roundedBox(332, 62, 136, 40, 10, lab.power ? "#20485a" : "#192d3e", "#597487");
    label("DC SUPPLY", 400, 83, "#d3e4ef", 15, "center");
    label("−", 346, 82, "#a5dfff", 19, "center");
    label("+", 454, 82, "#ffd096", 19, "center");
    label("LAMP", lampX, 48, "#f1cb87", 15, "center");
    if (lab.power) {
      arrow(260, 177, 55, "#86d9ff");
      arrow(681, 618, 55, "#86d9ff");
    }
  }

  function drawHeater(y) {
    const glow = ctx.createRadialGradient(120, y, 8, 120, y, 93);
    glow.addColorStop(0, `rgba(247,124,67,${lab.heaterLevel * .48})`);
    glow.addColorStop(1, "#f77c4300");
    circle(120, y, 93, glow);
    roundedBox(114, y - 89, 24, 178, 7, "#41383b", "#866b63");
    ctx.save();
    ctx.globalAlpha = lab.heaterLevel;
    roundedBox(114, y - 89, 24, 178, 7, "#f57b4e", "#ffd19b");
    ctx.restore();
    for (let slit = y - 70; slit < y + 81; slit += 19) {
      line([[120, slit], [131, slit - 4]], "#efc7a6", 1.7);
    }
  }

  function drawHammer() {
    const approach = lab.impact ? Math.min((swingTime - lab.impact) / .32, lab.impact / .22, 1) : 0;
    const frontIon = metalIonPosition(ions[0]);
    const contactX = frontIon.x - frontIon.radius;
    const x = 82 + (contactX - 38 - 82) * approach;
    const y = frontIon.y + 4 * (1 - approach);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-.23 * (1 - approach));
    roundedBox(-11, 8, 16, 68, 5, "#a46c4e", "#d79d72");
    roundedBox(-28, -18, 59, 32, 6, "#a3b7c8", "#d9e7ee");
    roundedBox(26, -20, 12, 36, 3, "#c7d8e4", "#e6f0f4");
    ctx.restore();
    if (approach === 1) {
      line([[contactX - 5, y - 20], [contactX + 2, y - 30]], "#f9c880", 2);
      line([[contactX - 5, y + 17], [contactX + 3, y + 26]], "#f9c880", 2);
    }
  }

  function drawThermalFill(y, values) {
    const gradient = ctx.createLinearGradient(left, 0, right, 0);
    values.forEach((value, index) => {
      gradient.addColorStop(index / (values.length - 1), `rgba(255,112,55,${value * .7})`);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(left, y, right - left, bottom - top);
  }

  const ionColours = {
    positive: ["#ffd5aa", "#c98354", "#ffcd9d", "#54342c"],
    alloy: ["#dfd0ff", "#9278ca", "#d8c1ff", "#30264b"],
    negative: ["#bbf3dc", "#55ad9a", "#a5e9d4", "#173d35"]
  };

  function drawIon(x, y, radius, kind) {
    const [light, dark, edge, ink] = ionColours[kind];
    const fill = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    fill.addColorStop(0, light);
    fill.addColorStop(1, dark);
    circle(x, y, radius, fill, edge);
    label(kind === "negative" ? "−" : "+", x, y + 1, ink, radius + 4, "center", 750);
  }

  function metalIonPosition(ion) {
    const changed = alloy() && ion.mixed;
    const nearChanged = alloy() && !changed && ion.neighbour;
    const blocksSlip = changed && (ion.row === 1 || ion.row === 2);
    const siteX = ion.x + layerShift(ion.y) + (changed ? ion.variation * 4 : nearChanged ? 4 : 0);
    const siteY = ion.y + (blocksSlip ? (ion.row === 1 ? 7 : -7) : changed ? ion.variation * 4 : nearChanged ? 5 : 0);
    const radius = blocksSlip ? 25 : changed ? (ion.variation > 0 ? 21 : 12) : 17;
    const warmth = localHeat(ion.x);
    // Each ion vibrates around its lattice site, including after a collision.
    const displacement = Math.sin(lab.time * ion.frequency + ion.phase) * (.85 + warmth * 2.15);
    const sinceBump = .32 - ion.bump;
    const kick = ion.bump > 0 ? Math.sin(sinceBump * 25) * 4 * ion.bump / .32 : 0;
    const x = siteX + Math.cos(ion.phase) * displacement + ion.bumpX * kick;
    const y = siteY + Math.sin(ion.phase) * displacement + ion.bumpY * kick;
    return { x, y, radius, warmth, changed, blocksSlip };
  }

  function drawCollision(x, y, strength) {
    ctx.save();
    ctx.globalAlpha = limit(strength, 0, 1);
    circle(x, y, 9, "#ffcc764d");
    circle(x, y, 3.6, "#fff0a9");
    line([[x - 10, y], [x - 5, y]], "#ffdb8b", 1.5);
    line([[x + 5, y], [x + 10, y]], "#ffdb8b", 1.5);
    line([[x, y - 10], [x, y - 5]], "#ffdb8b", 1.5);
    line([[x, y + 5], [x, y + 10]], "#ffdb8b", 1.5);
    ctx.restore();
  }

  function drawMetalElectrons() {
    for (const electron of electrons) {
      if (electron.wire !== null) continue;
      const y = electron.y;
      const offset = y < slipPlane ? lab.shift : 0;
      const x = limit(electron.x + layerShift(y), left + offset + 3, right + offset - 3);
      const warmth = electron.warmth;
      const colour = warmth > .35 ? "#ffdf9c" : "#acdefc";
      const trail = lab.power ? 10 : warmth * 15;
      if (trail > 1) {
        const angle = lab.power ? 0 : electron.angle;
        line([[x - trail * Math.cos(angle), y - trail * Math.sin(angle)], [x, y]], warmth > .35 ? "#ffc47077" : "#82d5ff69", 1.5);
      }
      drawElectron(x, y, colour);
    }
  }

  function drawMaterial() {
    const path = new Path2D();
    path.moveTo(left + lab.shift, top);
    path.lineTo(right + lab.shift, top);
    path.lineTo(right + lab.shift, slipPlane);
    path.lineTo(right, slipPlane);
    path.lineTo(right, bottom);
    path.lineTo(left, bottom);
    path.lineTo(left, slipPlane);
    path.lineTo(left + lab.shift, slipPlane);
    path.closePath();
    ctx.save();
    ctx.clip(path);
    ctx.fillStyle = "#142b42";
    ctx.fillRect(left, top, right - left + 90, bottom - top);
    if (lab.mode === "heat") drawThermalFill(top, heat);
    if (!alloy()) {
      for (let row = 0; row < 5; row++) {
        const y = 151 + 45 * row;
        line([[left + layerShift(y), y], [right + layerShift(y), y]], "#719ab43b", 1.5);
      }
    }
    const showElectronsOnTop = lab.mode === "electricity" || lab.mode === "heat";
    if (!showElectronsOnTop) drawMetalElectrons();
    for (const ion of ions) {
      const { x, y, radius, changed, blocksSlip } = metalIonPosition(ion);
      if (lab.mode === "hammer" && blocksSlip) {
        const highlight = lab.impact > 0 && lab.impact < .4;
        circle(x, y, radius + (highlight ? 6 : 4), highlight ? "#ffd08e8c" : "#cbb1ff32", highlight ? "#ffe1a2" : "#d7bfff");
      }
      drawIon(x, y, radius, changed ? "alloy" : "positive");
      if (ion.bump > 0) drawCollision(x - ion.bumpX * radius, y - ion.bumpY * radius, ion.bump / .32);
    }
    if (showElectronsOnTop) drawMetalElectrons();
    ctx.restore();
    ctx.strokeStyle = "#6693b8";
    ctx.lineWidth = 1.6;
    ctx.stroke(path);
  }

  function drawIonicSolid() {
    const y = top + ionicOffset;
    roundedBox(left, y, right - left, bottom - top, 4, "#142b42", "#6693b8");
    drawThermalFill(y, ionicHeat);
    const vibratingIons = ionicIons.map((ion) => {
      const warmth = localHeat(ion.x, ionicHeat);
      // The local vibration travels along the row while each ion stays near its own site.
      const vibration = Math.sin(lab.time * 6 - ion.column * 1.5 + ion.row * .85);
      const x = ion.x + vibration * (.55 + warmth * 2.6);
      return { ...ion, x, warmth };
    });
    vibratingIons.forEach((ion, index) => {
      drawIon(ion.x, ion.y, ion.radius, ion.negative ? "negative" : "positive");
      if (ion.column === 0) return;
      const neighbour = vibratingIons[index - 1];
      const gap = ion.x - ion.radius - neighbour.x - neighbour.radius;
      const warmth = Math.min(ion.warmth, neighbour.warmth);
      if (gap < .75 && warmth > .13) {
        drawCollision(ion.x - ion.radius - gap / 2, ion.y, (1 - gap / .75) * warmth * 1.8);
      }
    });
  }

  function drawAnnotations() {
    if (lab.mode === "structure") {
      label(alloy() ? "DISTORTED LATTICE" : "REGULAR LATTICE", 400, 78, "#b5cede", 18, "center", 730);
      label(alloy() ? "Different-sized ions interrupt the regular layers" : "Positive ions in a sea of delocalised electrons", 400, 398, "#c2dbe9", 17, "center", 550);
    }
    if (lab.mode === "electricity") {
      if (lab.power) arrow(207, 595, 392, "#86d9ff");
      label(lab.power ? "Net electron drift" : "No net drift", 400, lab.power ? 415 : 400, "#a6dcfa", 17, "center");
    }
    if (lab.mode === "hammer") {
      label("DIRECTION OF STRIKE", 140, 83, "#d8b994", 16);
      arrow(140, 280, 106, "#deb78b");
      if (alloy()) {
        label("Oversized ions obstruct the sliding layer", 400, 400, "#e2d1ff", 19, "center");
      } else {
        if (lab.shift > 8) arrow(left, left + lab.shift, 385, "#9cddfa");
        label(lab.strikes ? "Upper layers slide over the lower layers" : "Strike the top layers and watch them slide", 400, 410, "#bbd2e5", 19, "center");
      }
    }
  }

  function thermalLabels(values, y, mechanism) {
    label(degrees(values[0]), left, y, "#ffd5ab", 20);
    label(degrees(values.at(-1)), right, y, "#d5e7f2", 20, "right");
    if (values[0] - values.at(-1) > .08) arrow(250, 550, y - 7, "#ffbe82");
    label(mechanism, 400, y + 14, "#dcebf2", 18, "center");
  }

  function drawHeatComparison() {
    const metalOffset = -62;
    drawHeater(middle + metalOffset);
    ctx.save();
    ctx.translate(0, metalOffset);
    drawMaterial();
    ctx.restore();
    label("METAL", 400, top + metalOffset - 24, "#a5dfff", 20, "center");
    thermalLabels(heat, bottom + metalOffset + 20, "Electrons bump ions and pass on energy");

    drawHeater(middle + ionicOffset);
    drawIonicSolid();
    label("IONIC SOLID", 400, top + ionicOffset - 11, "#a9ebd8", 20, "center");
    thermalLabels(ionicHeat, bottom + ionicOffset + 21, "Neighbouring ions bump and pass on energy");
  }

  const canvasHeight = () => lab.mode === "heat" ? 665 : 444;
  function draw() {
    const height = canvasHeight();
    ctx.setTransform(canvas.width / 800, 0, 0, canvas.height / height, 0, 0);
    drawBackground(height);
    if (lab.mode === "heat") {
      drawHeatComparison();
      return;
    }
    drawMaterial();
    if (lab.mode === "electricity") drawCircuit();
    if (lab.mode === "hammer") drawHammer();
    drawAnnotations();
  }
  function resizeCanvas() {
    const scale = limit(canvas.getBoundingClientRect().width * devicePixelRatio / 800, 1, 2.5);
    const width = Math.round(800 * scale);
    const height = Math.round(canvasHeight() * scale);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    draw();
  }
  new ResizeObserver(resizeCanvas).observe(canvas.parentElement);
  let lastFrame;
  let lastReadout = 0;
  function tick(now) {
    const elapsed = Math.min((now - (lastFrame ?? now)) / 1000, .034);
    lastFrame = now;
    if (!lab.paused) {
      const dt = elapsed * lab.speed;
      simulate(dt / 2);
      simulate(dt / 2);
      draw();
      if (now - lastReadout > 140) {
        updateMeasurements();
        lastReadout = now;
      }
    }
    requestAnimationFrame(tick);
  }
  renderState();
  requestAnimationFrame(tick);

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute("aria-selected", active);
      item.tabIndex = active ? 0 : -1;
      byId(item.getAttribute("aria-controls")).hidden = !active;
    }
    if (focus) tab.focus();
  }
  for (const tab of tabs) {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const tabIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (tabs.indexOf(tab) + 1) % tabs.length;
      selectTab(tabs[tabIndex], true);
    });
  }

  const quizContent = [
    {
      tiles: ["negative ions", "regular layers", "delocalised electrons", "molecules", "electrostatic attraction", "positive metal ions", "fixed electrons"],
      answers: ["positive metal ions", "regular layers", "electrostatic attraction", "delocalised electrons"]
    },
    {
      tiles: ["electrical charge", "positive ions only", "stay in fixed positions", "delocalised electrons", "thermal energy", "drift through the lattice"],
      answers: ["delocalised electrons", "drift through the lattice", "electrical charge"]
    },
    {
      tiles: ["transfer energy to the cooler handle", "gain kinetic energy", "lose kinetic energy", "carry energy only at the hot end"],
      answers: ["gain kinetic energy", "transfer energy to the cooler handle"]
    }
  ];
  const scores = quizContent.map(() => 0);
  const questions = [...document.querySelectorAll("[data-page]")];
  const questionButtons = [...document.querySelectorAll("[data-question]")];
  questionButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      questionButtons.forEach((item, itemIndex) => {
        item.setAttribute("aria-pressed", itemIndex === index);
        questions[itemIndex].hidden = itemIndex !== index;
      });
    });
  });

  function setupQuestion(question, page) {
    const { tiles, answers } = quizContent[page];
    const placements = answers.map(() => null);
    const blanks = [...question.querySelectorAll("[data-slot]")];
    const controls = byId("answer-controls").content.cloneNode(true);
    question.querySelector("h3").after(controls.querySelector(".answer-instructions"));
    question.append(controls);
    const wordBank = question.querySelector(".word-bank");
    const feedback = question.querySelector(".feedback");
    let selectedTile = null;
    let checked = false;

    function renderTiles() {
      blanks.forEach((blank, index) => {
        const tile = placements[index];
        const isCorrect = tile === answers[index];
        const result = checked ? (isCorrect ? ", correct" : ", try again") : "";
        blank.textContent = tile ?? "";
        blank.setAttribute("aria-label", `Box ${index + 1}, ${tile ?? "empty"}${result}`);
        blank.classList.toggle("filled", tile !== null);
        blank.classList.toggle("correct", checked && isCorrect);
        blank.classList.toggle("incorrect", checked && !isCorrect);
      });
      for (const button of wordBank.children) {
        button.setAttribute("aria-pressed", selectedTile === button.textContent);
        button.classList.toggle("used", placements.includes(button.textContent));
      }
    }

    function updateScore(points) {
      scores[page] = points;
      byId("marks").textContent = scores.reduce((sum, score) => sum + score, 0) + " / 9 marks";
    }

    function clearCheck() {
      checked = false;
      feedback.textContent = "";
      feedback.className = "feedback";
      updateScore(0);
    }

    function placeTile(index, tile) {
      if (tile) {
        const previous = placements.indexOf(tile);
        if (previous !== -1) placements[previous] = null;
      }
      placements[index] = tile;
      selectedTile = null;
      clearCheck();
      renderTiles();
    }

    tiles.forEach((tile) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "word";
      button.textContent = tile;
      button.addEventListener("click", () => {
        selectedTile = selectedTile === tile ? null : tile;
        renderTiles();
      });
      wordBank.append(button);
    });
    blanks.forEach((blank, index) => blank.addEventListener("click", () => placeTile(index, selectedTile)));
    question.querySelector(".check-answer").addEventListener("click", () => {
      if (placements.includes(null)) {
        feedback.textContent = "Fill all the boxes before checking.";
        feedback.className = "feedback retry";
        return;
      }
      const points = answers.filter((answer, index) => answer === placements[index]).length;
      const correct = points === answers.length;
      checked = true;
      feedback.textContent = `${points} / ${answers.length}. ${correct ? "All boxes are correct." : "Revisit the boxes marked ‘try again’ or outlined in amber."}`;
      feedback.className = "feedback " + (correct ? "good" : "retry");
      updateScore(points);
      renderTiles();
    });
    question.querySelector(".clear-answer").addEventListener("click", () => {
      placements.fill(null);
      selectedTile = null;
      clearCheck();
      renderTiles();
    });
    makeTilesDraggable(question, wordBank, blanks, placeTile);
    renderTiles();
  }

  function makeTilesDraggable(question, wordBank, blanks, placeTile) {
    let drag = null;
    let suppressPointerClick = false;
    question.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      suppressPointerClick = false;
      const tile = event.target.closest(".word, .blank.filled");
      if (!tile) return;
      drag = { tile, id: event.pointerId, x: event.clientX, y: event.clientY, preview: null };
    });
    document.addEventListener("pointermove", (event) => {
      if (drag?.id !== event.pointerId) return;
      if (!drag.preview) {
        if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
        drag.tile.setPointerCapture(event.pointerId);
        drag.preview = document.createElement("span");
        drag.preview.className = "word drag-preview";
        drag.preview.setAttribute("aria-hidden", "true");
        drag.preview.textContent = drag.tile.textContent;
        document.body.append(drag.preview);
      }
      drag.preview.style.left = event.clientX + "px";
      drag.preview.style.top = event.clientY + "px";
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".blank");
      blanks.forEach((blank) => blank.classList.toggle("drag-over", blank === target));
    });
    function endDrag(event) {
      if (drag?.id !== event.pointerId) return;
      const { tile, preview } = drag;
      drag = null;
      if (!preview) return;
      preview.remove();
      blanks.forEach((blank) => blank.classList.remove("drag-over"));
      if (event.type === "pointercancel") return;
      suppressPointerClick = true;
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".blank, .word-bank");
      if (blanks.includes(target)) placeTile(Number(target.dataset.slot), tile.textContent);
      if (target === wordBank && tile.matches(".blank")) placeTile(Number(tile.dataset.slot), null);
    }
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);
    question.addEventListener("click", (event) => {
      if (!suppressPointerClick || !event.detail) return;
      event.stopPropagation();
      suppressPointerClick = false;
    }, true);
  }

  questions.forEach(setupQuestion);
})();
