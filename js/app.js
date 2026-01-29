// js/app.js

const splash = document.getElementById("splash");
const enterBtn = document.getElementById("enter");

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");
const counter = document.getElementById("counter");

// Update these counts if you add/remove images.
// Expected filenames per folder: 01.jpg ... 12.jpg
const projects = {
  "on-seeing": 12,
  "in-passing": 12,
  "meanwhile": 12
};

let current = 1;
let activeProject = null;

// Enter site
enterBtn.onclick = () => splash.remove();

// Open a project
document.querySelectorAll("[data-project]").forEach((link) => {
  link.onclick = (e) => {
    e.preventDefault();
    activeProject = link.dataset.project;
    current = 1;
    openImage();
  };
});

function openImage() {
  viewer.hidden = false;

  const filename = `${String(current).padStart(2, "0")}.jpg`;
  viewerImg.src = `images/${activeProject}/${filename}`;

  // If an image is missing, show a clear fallback in the counter and stop advancing
  viewerImg.onerror = () => {
    counter.textContent = `Missing: images/${activeProject}/${filename}`;
  };

  counter.textContent = `${current} / ${projects[activeProject]}`;
}

// Advance ONLY when clicking inside the viewer (not anywhere on the page)
viewer.onclick = () => {
  if (viewer.hidden) return;

  current += 1;

  if (current > projects[activeProject]) {
    viewer.hidden = true;
    return;
  }

  openImage();
};

// Keyboard controls
window.onkeydown = (e) => {
  if (viewer.hidden) return;

  if (e.key === "Escape") {
    viewer.hidden = true;
    return;
  }

  if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
    // next
    current = Math.min(projects[activeProject], current + 1);
    openImage();
  }

  if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
    // previous
    current = Math.max(1, current - 1);
    openImage();
  }
};
