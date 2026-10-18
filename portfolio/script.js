/* =========================================================
   EDIT THIS SECTION ONLY (settings)
   ========================================================= */

// 1) Resume: put resume.pdf in the same folder, then change false to true.
const RESUME_READY = true;
const RESUME_FILE = "resume.pdf";

// 2) GitHub: paste your exact profile URL, e.g. "https://github.com/yourname"
//    Leave "" to keep the GitHub link hidden.
const GITHUB_URL = "";

// 3) Project status: "Completed" or "In Progress"
const PROJECT_STATUS = {
  cnn:  "Completed",   // Cat vs Dog Image Classification
  lstm: "Completed",   // Next Word Prediction Using LSTM
  ids:  "In Progress"    // Network Intrusion Detection
};

// 4) Project links (leave "" if you have none; no link is shown then)
const PROJECT_LINKS = {
  cnn:  { code: "https://github.com/tumhara-username/cat-vs-dog", demo: "" },
  lstm: { code: "", demo: "" },
  ids:  { code: "", demo: "" }
};

const EMAIL = "ashishsinghdbg1234@gmail.com";

/* =========================================================
   Code below needs no editing
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#yr").textContent = new Date().getFullYear();

/* ---- Mobile menu ---- */
const burger = $("#burger"), menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---- Resume button ---- */
const resumeBtn = $("#resumeBtn"), resumeMsg = $("#resumeMsg");
if (RESUME_READY) {
  resumeBtn.href = RESUME_FILE;
  resumeBtn.setAttribute("download", "Ashish_Kumar_Singh_Resume.pdf");
  resumeBtn.removeAttribute("role");
} else {
  resumeBtn.classList.add("off");
  resumeBtn.setAttribute("aria-disabled", "true");
  resumeBtn.addEventListener("click", e => {
    e.preventDefault();
    resumeMsg.hidden = false;
    resumeMsg.textContent = "Resume not added yet. Place your resume.pdf in this folder, then set RESUME_READY = true in script.js.";
  });
}

/* ---- GitHub link ---- */
if (/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(GITHUB_URL)) {
  $("#ghLink").href = GITHUB_URL;
  $("#ghWrap").hidden = false;
}

/* ---- Project status, links and expanding cards ---- */
$$(".card").forEach(card => {
  const id = card.dataset.project;
  const st = $(`[data-status-for="${id}"]`, card);
  st.textContent = PROJECT_STATUS[id] || "In Progress";
  st.classList.toggle("done", st.textContent === "Completed");

  const box = $(`[data-links-for="${id}"]`, card);
  const L = PROJECT_LINKS[id] || {};
  [["code", "View code"], ["demo", "Live demo"]].forEach(([k, label]) => {
    if (/^https?:\/\//.test(L[k] || "")) {
      const a = document.createElement("a");
      a.className = "btn ghost"; a.href = L[k]; a.textContent = label;
      a.target = "_blank"; a.rel = "noopener noreferrer";
      box.appendChild(a);
    }
  });

  const head = $(".card-head", card);
  head.addEventListener("click", () => {
    const open = card.classList.toggle("open");
    head.setAttribute("aria-expanded", open);
  });
});

/* ---- Gentle reveal on section headings ---- */
$$(".sec h2").forEach(h => h.classList.add("reveal"));
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .2 });
  $$(".reveal").forEach(el => io.observe(el));
} else { $$(".reveal").forEach(el => el.classList.add("in")); }

/* ---- Highlight current nav link ---- */
if ("IntersectionObserver" in window) {
  const links = $$("nav a");
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => so.observe(s));
}

/* ---- Contact form (mailto, no server) ---- */
const form = $("#form");
const setErr = (id, msg) => {
  $("#e-" + id).textContent = msg;
  $("#" + id).classList.toggle("bad", !!msg);
  return !msg;
};
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#name").value.trim(), email = $("#email").value.trim(), msg = $("#msg").value.trim();
  const okName = setErr("name", name ? "" : "Please enter your name.");
  const okMail = setErr("email", !email ? "Please enter your email." :
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Enter a valid email, like name@example.com.");
  const okMsg = setErr("msg", msg ? "" : "Please write a message.");
  if (!(okName && okMail && okMsg)) return;

  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(msg + "\n\nFrom: " + name + " (" + email + ")");
  const ok = $("#formOk");
  ok.hidden = false;
  ok.textContent = "Opening your email app. If nothing opens, write to " + EMAIL + " directly.";
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

/* ---- Background particles ---- */
(function () {
  const c = $("#bg"), ctx = c.getContext("2d");
  let w, h, dots = [];
  function size() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    const n = Math.min(70, Math.floor(w * h / 22000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.6 + .5
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((d, i) => {
      if (!reduceMotion) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      ctx.fillStyle = "rgba(120,200,255,.6)";
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const o = dots[j], dist = Math.hypot(d.x - o.x, d.y - o.y);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(139,92,246,${.25 * (1 - dist / 110)})`;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
        }
      }
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  size(); draw();
  addEventListener("resize", () => { size(); if (reduceMotion) draw(); });
})();