document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
     Helpers
  ----------------------------- */

  function formatProjectName(slug) {
    return slug.replace(/-/g, " ").toUpperCase();
  }

/* -----------------------------
   Splash
----------------------------- */

const splash = document.getElementById("splash");
const enterBtn = document.getElementById("enter");

function dismissSplash() {
  splash.remove();
}

if (enterBtn && splash) {
  enterBtn.addEventListener("click", dismissSplash);
}


// If opening with a hash, skip splash and jump.
if (window.location.hash && splash) {
  dismissSplash();

  setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: "auto" });
    }
  }, 0);
}



  // force vertical scroll after splash removal
  setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "auto"
      });
    }
  }, 0);
}


  /* -----------------------------
     Work titles (from folder names)
  ----------------------------- */

  document.querySelectorAll("[data-project]").forEach((card) => {
    const slug = card.dataset.project;
    const titleEl = card.querySelector(".card-title");

    if (titleEl && slug) {
      titleEl.textContent = formatProjectName(slug);
    }
  });

  /* -----------------------------
     Viewer logic
  ----------------------------- */

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewer-img");
  const counter = document.getElementById("counter");

  const projects = {
    "on-seeing": 12,
    "in-passing": 12,
    "meanwhile": 12
  };

  let current = 1;
  let activeProject = null;

  document.querySelectorAll("[data-project]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activeProject = link.dataset.project;
      current = 1;
      openImage();
    });
  });

  function openImage() {
    if (!viewer || !viewerImg || !counter) return;

    viewer.hidden = false;

    const filename = `${String(current).padStart(2, "0")}.jpg`;
    viewerImg.src = `images/${activeProject}/${filename}`;

    viewerImg.onerror = () => {
      counter.textContent = `Missing: images/${activeProject}/${filename}`;
    };

    counter.textContent = `${current} / ${projects[activeProject]}`;
  }

  if (viewer) {
    viewer.addEventListener("click", () => {
      if (viewer.hidden) return;

      current += 1;

      if (current > projects[activeProject]) {
        viewer.hidden = true;
        return;
      }

      openImage();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!viewer || viewer.hidden) return;

    if (e.key === "Escape") {
      viewer.hidden = true;
      return;
    }

    if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
      current = Math.min(projects[activeProject], current + 1);
      openImage();
    }

    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      current = Math.max(1, current - 1);
      openImage();
    }
  });

  /* -----------------------------
     Subtle hover drift (parallax)
  ----------------------------- */

  document.querySelectorAll(".card").forEach((card) => {
    const img = card.querySelector(".card-media img");
    if (!img) return;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const dx = (px - 0.5) * 10;
      const dy = (py - 0.5) * 6;

      img.style.transform = `scale(1.08) translate(${dx}px, ${dy}px)`;
    });

    card.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1.03) translate(0, 0)";
    });
  });

});
