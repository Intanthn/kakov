(function () {
  "use strict";

  const cfg = BIRTHDAY_CONFIG;
  const candleCount = cfg.candleCount || 5;

  let litCount = 0;
  let allBlown = false;
  let allWereLit = false;
  let candles = [];

  const row = document.getElementById("candles-row");
  const hint = document.getElementById("cake-hint");
  const status = document.getElementById("cake-status");
  const lightAllBtn = document.getElementById("light-all-btn");
  const blowBtn = document.getElementById("blow-btn");
  const relightBtn = document.getElementById("relight-btn");
  const wishBanner = document.getElementById("wish-banner");
  const cakeGlow = document.getElementById("cake-glow");
  const windBurst = document.getElementById("wind-burst");
  const smokeContainer = document.getElementById("smoke-container");
  const cakeSection = document.getElementById("cake-section");

  function buildCandles() {
    row.innerHTML = "";
    candles = [];

    for (let i = 0; i < candleCount; i++) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.setAttribute("role", "button");
      candle.setAttribute("aria-label", "Candle " + (i + 1));
      candle.innerHTML = `
        <div class="flame-wrap"><div class="flame"></div></div>
        <div class="candle-wick"></div>
        <div class="candle-stick"></div>
      `;
      candle.addEventListener("click", () => onCandleClick(candle));
      row.appendChild(candle);
      candles.push({ el: candle, lit: false, blown: false });
    }

    updateStatus();
  }

  function onCandleClick(candleEl) {
    if (allBlown) return;

    const data = candles.find((c) => c.el === candleEl);
    if (!data) return;

    if (data.lit && !data.blown) {
      blowSingleCandle(data);
      return;
    }

    if (!data.lit) {
      lightCandle(data);
    }
  }

  function lightCandle(data) {
    if (data.lit || allBlown) return;

    data.lit = true;
    data.el.classList.add("lighting");
    data.el.classList.add("lit");
    spawnSparks(data.el);
    litCount++;

    setTimeout(() => data.el.classList.remove("lighting"), 500);

    updateStatus();
    updateGlow();

    if (litCount === candleCount) {
      onAllLit();
    }
  }

  function spawnSparks(candleEl) {
    for (let i = 0; i < 5; i++) {
      const spark = document.createElement("span");
      spark.className = "candle-spark";
      spark.style.setProperty("--sx", (Math.random() - 0.5) * 40 + "px");
      spark.style.left = 50 + (Math.random() - 0.5) * 20 + "%";
      candleEl.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }

  function blowSingleCandle(data) {
    if (!data.lit || data.blown) return;

    data.blown = true;
    data.el.classList.add("blowing");
    spawnSmoke(data.el);
    litCount--;

    setTimeout(() => {
      data.el.classList.remove("lit", "blowing");
      data.lit = false;
    }, 600);

    updateStatus();
    updateGlow();

    if (litCount === 0 && candles.every((c) => c.blown || !c.lit)) {
      checkAllBlown();
    }
  }

  function blowAllCandles() {
    if (litCount === 0) return;

    windBurst.classList.add("active");
    setTimeout(() => windBurst.classList.remove("active"), 800);

    const litCandles = candles.filter((c) => c.lit && !c.blown);
    litCandles.forEach((data, i) => {
      setTimeout(() => {
        data.blown = true;
        data.el.classList.add("blowing");
        spawnSmoke(data.el);
        setTimeout(() => {
          data.el.classList.remove("lit", "blowing");
          data.lit = false;
        }, 600);
      }, i * 120);
    });

    litCount = 0;

    setTimeout(() => {
      updateStatus();
      updateGlow();
      checkAllBlown();
    }, litCandles.length * 120 + 700);
  }

  function spawnSmoke(candleEl) {
    const rect = candleEl.getBoundingClientRect();
    const containerRect = smokeContainer.getBoundingClientRect();

    for (let i = 0; i < 3; i++) {
      const puff = document.createElement("div");
      puff.className = "smoke-puff";
      puff.style.left = rect.left - containerRect.left + rect.width / 2 - 10 + "px";
      puff.style.animationDelay = i * 0.15 + "s";
      smokeContainer.appendChild(puff);
      setTimeout(() => puff.remove(), 2200);
    }
  }

  function onAllLit() {
    allWereLit = true;
    hint.textContent = candleCount === 1
      ? "Blow your candle! 💨"
      : "Make a wish… then blow out the candles! 💨";
    status.classList.add("all-lit");
    blowBtn.classList.remove("hidden");
    lightAllBtn.classList.add("hidden");
    cakeSection.classList.add("celebrating");
    setTimeout(() => cakeSection.classList.remove("celebrating"), 600);

    if (window.BirthdayFX) {
      window.BirthdayFX.launchConfetti(50);
    }
  }

  function checkAllBlown() {
    if (!allWereLit || litCount > 0) return;

    const allOut = candles.every((c) => c.blown);
    if (!allOut) return;

    allBlown = true;
    hint.textContent = "🎉 Happy birthday " + cfg.name + "!";
    status.textContent = "🎉 Happy Birthday! 🎉";
    status.classList.remove("all-lit");
    blowBtn.classList.add("hidden");
    relightBtn.classList.remove("hidden");
    wishBanner.classList.remove("hidden");
    cakeGlow.classList.remove("active");

    cakeSection.classList.add("celebrating");

    if (window.BirthdayFX) {
      window.BirthdayFX.launchConfetti(150);
      window.BirthdayFX.startFireworks(4000);
    }
  }

  function relightAll() {
    allBlown = false;
    allWereLit = false;
    litCount = 0;
    candles.forEach((c) => {
      c.lit = false;
      c.blown = false;
      c.el.classList.remove("lit", "blowing", "lighting");
    });

    hint.textContent = candleCount === 1
      ? "Tap the candle to light the fire 🔥"
      : "Tap each candle to put the fire on 🔥";
    wishBanner.classList.add("hidden");
    relightBtn.classList.add("hidden");
    if (candleCount > 1) lightAllBtn.classList.remove("hidden");
    blowBtn.classList.add("hidden");
    status.classList.remove("all-lit");
    updateStatus();
  }

  function lightAll() {
    if (allBlown) return;

    candles.forEach((data, i) => {
      if (!data.lit) {
        setTimeout(() => lightCandle(data), i * 150);
      }
    });
  }

  function updateStatus() {
    if (candleCount === 1) {
      status.textContent = litCount === 1 ? "Candle is lit! Make a wish 💫" : "Tap the candle to light it 🔥";
      return;
    }
    status.textContent = litCount + " / " + candleCount + " candles lit";
  }

  function updateGlow() {
    if (litCount > 0) {
      cakeGlow.classList.add("active");
      cakeGlow.style.opacity = Math.min(litCount / candleCount, 1);
    } else {
      cakeGlow.classList.remove("active");
    }
  }

  lightAllBtn.addEventListener("click", lightAll);
  blowBtn.addEventListener("click", blowAllCandles);
  relightBtn.addEventListener("click", relightAll);

  buildCandles();

  if (candleCount > 1) {
    lightAllBtn.classList.remove("hidden");
    hint.textContent = "Tap each candle to put the fire on 🔥";
  } else {
    lightAllBtn.classList.add("hidden");
    hint.textContent = "Tap the candle to light the fire 🔥";
  }

  window.BirthdayCake = { relightAll, lightAll, blowAllCandles };
})();
