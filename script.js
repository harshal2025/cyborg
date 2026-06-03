const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const modeCards = document.querySelectorAll(".mode-card");
const counters = document.querySelectorAll("[data-count]");
const canvas = document.querySelector(".signal-field");
const contactForm = document.querySelector(".contact-form");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let countersStarted = false;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(86, Math.floor(width / 18)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
  }));
}

function drawSignalField() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(77, 231, 255, 0.55)";
  ctx.strokeStyle = "rgba(77, 231, 255, 0.12)";
  ctx.lineWidth = 1;

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 1.4, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 118) {
        ctx.globalAlpha = 1 - distance / 118;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(drawSignalField);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

modeCards.forEach((card) => {
  card.addEventListener("click", () => {
    modeCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  button.textContent = "Request Transmitted";
  setTimeout(() => {
    button.textContent = "Transmit Request";
  }, 2200);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);

  if (!countersStarted && window.scrollY > window.innerHeight * 0.9) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawSignalField();
