document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- State ---------------- */

  let state = "splash"; // splash | work | page | viewer
  let activeProject = null;
  let currentIndex = 1;

  const projects = {
    "on-seeing": 12,
    "in-passing": 12,
    "meanwhile": 12
  };

  /* ---------------- Elements ---------------- */

  const body = document.body;
  const splash = document.getElementById("splash");
  const enterBtn = document.getElementById("enter");

  const workStrip = document.getElementById("work");

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewer-img");
  const viewerBackdrop = document.getElementById("viewer-backdrop");
  const counter = document.getElementById("counter");

  /* ---------------- State transitions ---------------- */

  function enterWork() {
    state = "work";
    splash.hidden = true;
    body.classList.remove("locked");
  }

  function enterPage(sectionId) {
    state = "page";
    body.classList.remove("locked");
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  }

  function openViewer(project) {
    state = "viewer";
    activeProject = project;
    currentIndex = 1;
    body.classList.add("locked");
    viewer.hidden = false;
    renderImage();
  }

  function closeViewer() {
    state = "work";
    viewer.hidden = true;
    body.classList.remove("locked");
  }

  /* ---------------- Splash ---------------- */

  enterBtn.addEventListener("click", enterWork);

  /* ---------------- Navigation ---------------- */

  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.nav;
      if (target === "work") {
        enterWork();
      } else {
        enterPage(target);
      }
    });
  });

  /* ---------------- Work cards ---------------- */

  document.querySelectorAll("[data-project]").forEach(card => {
    card.addEventListener("click", () => {
      openViewer(card.dataset.project);
    });
  });

  /* ---------------- Viewer ---------------- */

  function renderImage() {
    const file = `${String(currentIndex).padStart(2, "0")}.jpg`;
    viewerImg.src = `images/${activeProject}/${file}`;
    counter.textContent = `${currentIndex} / ${projects[activeProject]}`;
  }

  viewerBackdrop.addEventListener("click", closeViewer);

  window.addEventListener("keydown", (e) => {
    if (state !== "viewer") return;

    if (e.key === "Escape") {
      closeViewer();
    }

    if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
      currentIndex = Math.min(projects[activeProject], currentIndex + 1);
      renderImage();
    }

    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      currentIndex = Math.max(1, currentIndex - 1);
      renderImage();
    }
  });

  /* ---------------- Parallax ---------------- */

  document.querySelectorAll(".card").forEach(card => {
    const img = card.querySelector("img");

    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      img.style.transform = `scale(1.06) translate(${x * 12}px, ${y * 8}px)`;
    });

    card.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1.03) translate(0,0)";
    });
  });

});

/* ---------------- Viewer: mobile tap + swipe (iOS/Android) ---------------- */

const viewerContent = document.getElementById("viewer-content");

function nextImage() {
  if (currentIndex < projects[activeProject]) {
    currentIndex += 1;
    renderImage();
  } else {
    closeViewer();
  }
}

function prevImage() {
  if (currentIndex > 1) {
    currentIndex -= 1;
    renderImage();
  }
}

if (viewerContent) {
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let moved = false;

  const SWIPE_MIN = 35; // px
  const MOVE_TOL = 8;   // px

  // --- Touch fallback (works everywhere) ---
  viewerContent.addEventListener("touchstart", (e) => {
    if (state !== "viewer") return;
    if (e.touches.length !== 1) return;

    const t = e.touches[0];
    startX = lastX = t.clientX;
    startY = lastY = t.clientY;
    moved = false;
  }, { passive: true });

  viewerContent.addEventListener("touchmove", (e) => {
    if (state !== "viewer") return;
    if (e.touches.length !== 1) return;

    const t = e.touches[0];
    lastX = t.clientX;
    lastY = t.clientY;

    const dx = lastX - startX;
    const dy = lastY - startY;

    if (Math.abs(dx) > MOVE_TOL || Math.abs(dy) > MOVE_TOL) moved = true;

    // Prevent the browser from treating this as page scroll / navigation gesture
    e.preventDefault();
  }, { passive: false });

  viewerContent.addEventListener("touchend", (e) => {
    if (state !== "viewer") return;

    const dx = lastX - startX;
    const dy = lastY - startY;

    // Tap = next
    if (!moved) {
      nextImage();
      return;
    }

    // Horizontal swipe only (ignore mostly-vertical moves)
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) nextImage();  // swipe left
    else prevImage();         // swipe right
  }, { passive: true });

  // Kill “ghost click” after touch on some mobile browsers
  viewerContent.addEventListener("click", (e) => {
    if (state !== "viewer") return;
    e.preventDefault();
    e.stopPropagation();
  });
}



  /* ---------------- About: Portuguese reveal (persist) ---------------- */

  const ptReveal = document.getElementById("pt-reveal");
  const aboutPt = document.getElementById("about-pt");
  const PT_KEY = "about_pt_open";

  function openPortuguese() {
    if (!aboutPt || !ptReveal) return;
    aboutPt.hidden = false;
    ptReveal.setAttribute("aria-expanded", "true");
    localStorage.setItem(PT_KEY, "1");
  }

  // Restore persisted state
  try {
    if (localStorage.getItem(PT_KEY) === "1") {
      openPortuguese();
    }
  } catch (_) {
    // ignore storage errors (privacy mode, etc.)
  }

  if (ptReveal && aboutPt) {
    ptReveal.addEventListener("click", () => {
      if (!aboutPt.hidden) return; // no toggle, just reveal
      openPortuguese();
    });
  }
