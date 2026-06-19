(function () {
  "use strict";

  const cfg = BIRTHDAY_CONFIG;

  function assetUrl(src) {
    return (window.__BASE__ || "") + src;
  }

  // ── Apply theme ──
  document.documentElement.setAttribute("data-theme", cfg.theme || "ocean");

  // ── Populate static text ──
  document.getElementById("intro-name").textContent = cfg.name;
  document.getElementById("hero-name").textContent = cfg.name;

  if (cfg.birthdayDate) {
    const dateEl = document.getElementById("hero-date");
    dateEl.textContent = "🎉 " + cfg.birthdayDate;
    dateEl.style.display = "inline-block";
  }

  if (cfg.personalNote) {
    document.getElementById("note-text").textContent = cfg.personalNote;
  } else {
    document.getElementById("note-section").style.display = "none";
  }

  // ── Intro / open gift ──
  const intro = document.getElementById("intro");
  const main = document.getElementById("main-content");

  intro.addEventListener("click", openGift);
  intro.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openGift();
  });
  intro.setAttribute("tabindex", "0");

  let opened = false;
  function openGift() {
    if (opened) return;
    opened = true;

    document.querySelector(".gift-box").classList.add("opening");

    setTimeout(() => {
      intro.classList.add("hidden");
      main.classList.add("visible");

    launchConfetti(60);
    startBalloons();
    startParticles();
      initHeroStars();
      initSparkleTrail();
      initTypewriter();
      initPhotos();
      initScrollAnimations();
      initSectionReveal();

      if (cfg.music) {
        setupMusic(cfg.music);
      }
    }, 900);
  }

  // ── Expose FX for cake module ──
  window.BirthdayFX = {
    launchConfetti: launchConfetti,
    startFireworks: startFireworks,
  };

  // ── Confetti ──
  const confettiCanvas = document.getElementById("confetti-canvas");
  const confCtx = confettiCanvas.getContext("2d");
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas(confettiCanvas);
  window.addEventListener("resize", () => resizeCanvas(confettiCanvas));

  function launchConfetti(count) {
    const colors = ["#4fc3f7", "#ffd54f", "#fff176", "#29b6f6", "#81d4fa", "#ff7043", "#66bb6a"];

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces = confettiPieces.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rot += p.rotSpeed;
      p.opacity -= 0.003;

      if (p.opacity <= 0 || p.y > confettiCanvas.height + 50) return false;

      confCtx.save();
      confCtx.translate(p.x, p.y);
      confCtx.rotate((p.rot * Math.PI) / 180);
      confCtx.globalAlpha = Math.max(0, p.opacity);
      confCtx.fillStyle = p.color;
      confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confCtx.restore();
      return true;
    });

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
    }
  }

  // Periodic confetti bursts on scroll
  let lastConfetti = 0;
  window.addEventListener("scroll", () => {
    const now = Date.now();
    if (now - lastConfetti > 15000 && opened) {
      lastConfetti = now;
      launchConfetti(12);
    }
  });

  // ── Fireworks ──
  const fwCanvas = document.getElementById("fireworks-canvas");
  const fwCtx = fwCanvas ? fwCanvas.getContext("2d") : null;
  let fwParticles = [];
  let fwRunning = false;
  let fwEndTime = 0;

  function resizeFwCanvas() {
    if (!fwCanvas) return;
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  resizeFwCanvas();
  window.addEventListener("resize", resizeFwCanvas);

  function startFireworks(duration) {
    if (!fwCtx) return;
    fwEndTime = Date.now() + (duration || 5000);
    if (!fwRunning) {
      fwRunning = true;
      animateFireworks();
    }
    burstFirework();
    const interval = setInterval(() => {
      if (Date.now() > fwEndTime) {
        clearInterval(interval);
        return;
      }
      burstFirework();
      if (Math.random() > 0.5) burstFirework();
    }, 400);
  }

  function burstFirework() {
    if (!fwCanvas) return;
    const x = fwCanvas.width * (0.15 + Math.random() * 0.7);
    const y = fwCanvas.height * (0.1 + Math.random() * 0.4);
    const colors = ["#ffd54f", "#4fc3f7", "#ff7043", "#66bb6a", "#fff176", "#e040fb", "#ff5722"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 40 + Math.floor(Math.random() * 30);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 2 + Math.random() * 4;
      fwParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        size: 2 + Math.random() * 2,
        trail: [],
      });
    }
  }

  function animateFireworks() {
    if (!fwCtx || !fwCanvas) return;
    fwCtx.fillStyle = "rgba(10, 22, 40, 0.15)";
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    fwParticles = fwParticles.filter((p) => {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.vx *= 0.98;
      p.life -= p.decay;

      if (p.life <= 0) return false;

      p.trail.forEach((t, i) => {
        fwCtx.beginPath();
        fwCtx.arc(t.x, t.y, p.size * (i / p.trail.length) * 0.5, 0, Math.PI * 2);
        fwCtx.fillStyle = p.color;
        fwCtx.globalAlpha = p.life * (i / p.trail.length) * 0.4;
        fwCtx.fill();
      });

      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = p.color;
      fwCtx.globalAlpha = p.life;
      fwCtx.fill();
      fwCtx.globalAlpha = 1;

      return true;
    });

    if (fwParticles.length > 0 || Date.now() < fwEndTime) {
      requestAnimationFrame(animateFireworks);
    } else {
      fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
      fwRunning = false;
    }
  }

  // ── Hero stars ──
  function initHeroStars() {
    const container = document.getElementById("hero-stars");
    if (!container) return;

    for (let i = 0; i < 18; i++) {
      const star = document.createElement("div");
      star.className = "hero-star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.animationDuration = 1.5 + Math.random() * 2 + "s";
      container.appendChild(star);
    }
  }

  // ── Sparkle cursor trail (very subtle — dots only) ──
  function initSparkleTrail() {
    const trail = document.getElementById("sparkle-trail");
    if (!trail) return;

    let lastSparkle = 0;

    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastSparkle < 500) return;
      if (Math.random() > 0.12) return;
      lastSparkle = now;

      const el = document.createElement("span");
      el.className = "sparkle-particle dot";
      el.style.background = Math.random() > 0.5 ? "var(--gold)" : "var(--accent)";
      el.style.left = e.clientX + (Math.random() - 0.5) * 8 + "px";
      el.style.top = e.clientY + (Math.random() - 0.5) * 8 + "px";
      trail.appendChild(el);
      setTimeout(() => el.remove(), 500);
    });
  }

  // ── Section scroll reveal ──
  function initSectionReveal() {
    const sections = document.querySelectorAll(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // ── Background particles ──
  const particleCanvas = document.getElementById("particles-canvas");
  const pCtx = particleCanvas.getContext("2d");
  let particles = [];

  function startParticles() {
    resizeCanvas(particleCanvas);
    particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      r: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 0.6,
      opacity: 0.2 + Math.random() * 0.5,
    }));
    animateParticles();
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

    particles.forEach((p) => {
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = particleCanvas.height + 10;
        p.x = Math.random() * particleCanvas.width;
      }
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = accent;
      pCtx.globalAlpha = p.opacity;
      pCtx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => resizeCanvas(particleCanvas));

  // ── Balloons (minimal — just a few) ──
  const balloonsContainer = document.getElementById("balloons-container");
  let balloonCount = 0;
  const MAX_BALLOONS = 3;

  function startBalloons() {
    setInterval(() => {
      if (!opened || balloonCount >= MAX_BALLOONS) return;
      balloonCount++;
      const b = document.createElement("div");
      b.className = "balloon";
      b.textContent = "🎈";
      b.style.left = Math.random() * 90 + 5 + "%";
      b.style.animationDuration = 8 + Math.random() * 4 + "s";
      b.style.fontSize = "1.5rem";
      balloonsContainer.appendChild(b);
      setTimeout(() => {
        b.remove();
        balloonCount--;
      }, 14000);
    }, 12000);
  }

  // ── Typewriter messages ──
  let msgIndex = 0;
  let charIndex = 0;
  let typing = false;
  let typewriterTimer;

  function initTypewriter() {
    if (!cfg.messages || cfg.messages.length === 0) {
      document.querySelector(".messages-section").style.display = "none";
      return;
    }

    buildMessageDots();
    typeMessage();
  }

  function buildMessageDots() {
    const dots = document.getElementById("message-dots");
    dots.innerHTML = "";
    cfg.messages.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "message-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Message " + (i + 1));
      dot.addEventListener("click", () => {
        clearTimeout(typewriterTimer);
        msgIndex = i;
        charIndex = 0;
        typing = false;
        updateDots();
        typeMessage();
      });
      dots.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll(".message-dot").forEach((d, i) => {
      d.classList.toggle("active", i === msgIndex);
    });
  }

  function typeMessage() {
    if (typing) return;
    typing = true;
    charIndex = 0;
    const textEl = document.getElementById("typewriter-text");
    const msg = cfg.messages[msgIndex];
    textEl.innerHTML = "";

    function typeChar() {
      if (charIndex < msg.length) {
        textEl.innerHTML =
          msg.substring(0, charIndex + 1) + '<span class="typewriter-cursor"></span>';
        charIndex++;
        typewriterTimer = setTimeout(typeChar, 35 + Math.random() * 25);
      } else {
        textEl.innerHTML = msg + '<span class="typewriter-cursor"></span>';
        typing = false;
        typewriterTimer = setTimeout(() => {
          msgIndex = (msgIndex + 1) % cfg.messages.length;
          updateDots();
          typeMessage();
        }, 3500);
      }
    }
    typeChar();
  }

  // ── Photos: 3 main + sprinkles ──
  let allPhotos = [];

  function getPhotoLists() {
    const main = cfg.mainPhotos || (cfg.photos ? cfg.photos.slice(0, 3) : []);
    const sprinkles = cfg.sprinklePhotos || (cfg.photos ? cfg.photos.slice(3) : []);
    return { main, sprinkles };
  }

  function initPhotos() {
    const { main, sprinkles } = getPhotoLists();
    const mainContainer = document.getElementById("main-photos");
    const sprinkleContainer = document.getElementById("photo-sprinkles");
    const section = document.querySelector(".photos-section");

    allPhotos = [...main, ...sprinkles];

    if (main.length === 0) {
      if (section) section.style.display = "none";
      return;
    }

    mainContainer.innerHTML = "";
    main.forEach((photo, i) => {
      const card = document.createElement("div");
      card.className = "main-photo-card";
      card.style.transitionDelay = i * 0.2 + "s";
      card.innerHTML = `
        <div class="main-photo-frame">
          <span class="main-photo-badge">${i + 1}</span>
          <div class="main-photo-img-wrap">
            <img src="${assetUrl(photo.src)}" alt="Memory ${i + 1}" loading="lazy"
                 onerror="this.src='https://placehold.co/400x500/122240/4fc3f7?text=Photo+${i + 1}'">
            <div class="main-photo-shine"></div>
          </div>
          ${photo.caption ? `<p class="main-photo-caption">${photo.caption}</p>` : ""}
        </div>
      `;
      card.addEventListener("click", () => openLightbox(i));
      mainContainer.appendChild(card);
    });

    sprinkleContainer.innerHTML = "";

    if (sprinkles.length === 0) return;

    const targetCount = cfg.sprinkleCount || 24;
    const positions = [
      { top: "2%", left: "1%", rot: -15, size: 44, dur: 6, delay: 0 },
      { top: "4%", right: "2%", rot: 12, size: 40, dur: 5.5, delay: 0.3 },
      { top: "8%", left: "12%", rot: -8, size: 38, dur: 6.5, delay: 0.6 },
      { top: "6%", right: "14%", rot: 18, size: 42, dur: 5.8, delay: 0.2 },
      { top: "14%", left: "4%", rot: 10, size: 46, dur: 6.2, delay: 0.9 },
      { top: "16%", right: "6%", rot: -12, size: 40, dur: 5.4, delay: 0.5 },
      { top: "22%", left: "0%", rot: -6, size: 36, dur: 7, delay: 1.1 },
      { top: "24%", right: "1%", rot: 8, size: 38, dur: 6.8, delay: 0.7 },
      { top: "28%", left: "18%", rot: -20, size: 42, dur: 5.6, delay: 0.4 },
      { top: "30%", right: "18%", rot: 15, size: 44, dur: 6.4, delay: 1.3 },
      { top: "38%", left: "2%", rot: 6, size: 40, dur: 5.9, delay: 0.8 },
      { top: "40%", right: "3%", rot: -10, size: 36, dur: 6.6, delay: 0.1 },
      { top: "48%", left: "10%", rot: -14, size: 38, dur: 5.7, delay: 1.0 },
      { top: "50%", right: "10%", rot: 11, size: 42, dur: 6.3, delay: 0.6 },
      { top: "58%", left: "0%", rot: 9, size: 44, dur: 5.5, delay: 1.4 },
      { top: "60%", right: "0%", rot: -7, size: 40, dur: 6.9, delay: 0.2 },
      { top: "68%", left: "14%", rot: -16, size: 36, dur: 5.8, delay: 0.9 },
      { top: "70%", right: "14%", rot: 13, size: 38, dur: 6.1, delay: 1.2 },
      { top: "76%", left: "3%", rot: 5, size: 42, dur: 6.7, delay: 0.5 },
      { top: "78%", right: "4%", rot: -9, size: 40, dur: 5.6, delay: 0.3 },
      { top: "10%", left: "28%", rot: -4, size: 34, dur: 7.2, delay: 1.5 },
      { top: "12%", right: "28%", rot: 7, size: 34, dur: 6.8, delay: 1.1 },
      { top: "44%", left: "22%", rot: -11, size: 36, dur: 6.0, delay: 0.7 },
      { top: "46%", right: "22%", rot: 10, size: 36, dur: 5.4, delay: 1.6 },
      { top: "82%", left: "26%", rot: -5, size: 38, dur: 6.5, delay: 0.4 },
      { top: "84%", right: "26%", rot: 6, size: 38, dur: 5.9, delay: 1.0 },
      { top: "32%", left: "6%", rot: 14, size: 32, dur: 7.5, delay: 1.7 },
      { top: "34%", right: "7%", rot: -13, size: 32, dur: 7.0, delay: 0.8 },
      { top: "52%", left: "28%", rot: 8, size: 34, dur: 6.2, delay: 1.3 },
      { top: "54%", right: "28%", rot: -8, size: 34, dur: 5.8, delay: 0.6 },
    ];

    for (let i = 0; i < targetCount; i++) {
      const photo = sprinkles[i % sprinkles.length];
      const pos = positions[i % positions.length];
      const el = document.createElement("div");
      el.className = "photo-sprinkle";
      el.style.setProperty("--rot", pos.rot + "deg");
      el.style.setProperty("--size", pos.size + "px");
      el.style.setProperty("--dur", pos.dur + "s");
      el.style.setProperty("--delay", pos.delay + "s");
      el.style.top = pos.top;
      if (pos.left) el.style.left = pos.left;
      if (pos.right) el.style.right = pos.right;
      el.innerHTML = `<img src="${assetUrl(photo.src)}" alt="" loading="lazy"
        onerror="this.src='https://placehold.co/80x80/122240/4fc3f7?text=${(i % sprinkles.length) + 1}'">`;
      sprinkleContainer.appendChild(el);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".main-photo-card").forEach((c) => observer.observe(c));
  }

  // ── Lightbox ──
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let lightboxIndex = 0;

  function openLightbox(index) {
    const photo = allPhotos[index];
    if (!photo) return;
    lightboxIndex = index;
    lightboxImg.src = assetUrl(photo.src);
    lightboxCaption.textContent = photo.caption || "";
    lightbox.classList.add("open");
    launchConfetti(20);
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") openLightbox((lightboxIndex + 1) % allPhotos.length);
    if (e.key === "ArrowLeft")
      openLightbox((lightboxIndex - 1 + allPhotos.length) % allPhotos.length);
  });

  // ── Scroll reveal ──
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".photo-card").forEach((card) => observer.observe(card));

    document.querySelectorAll(".section-title, .messages-box, .photos-showcase, .note-card").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
      observer.observe(el);
    });

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".section-title, .messages-box, .photos-showcase, .note-card").forEach((el) => {
      animObserver.observe(el);
    });
  }

  // ── Music ──
  function setupMusic(src) {
    const audio = document.getElementById("bg-music");
    const btn = document.getElementById("music-btn");
    audio.src = src;
    btn.classList.add("visible");

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.classList.add("playing");
        btn.textContent = "🔊";
      } else {
        audio.pause();
        btn.classList.remove("playing");
        btn.textContent = "🔇";
      }
    });
  }
})();
