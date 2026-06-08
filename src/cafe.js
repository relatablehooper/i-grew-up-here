/* ============================================================================
   cafe.js — THE CAFE (the convergence / climax)
   ----------------------------------------------------------------------------
   This is the destination of the whole memory palace, not a stop. Every other
   room shows ONE version of the narrator at a time; the cafe shows them
   simultaneously — eight, fifteen, and now — at one table. That collision of
   times in a single frame is the "temporal collapse" the assignment names as
   a key post-modern device (CLAUDE.md sections 1 and 2). The thesis ("I grew
   up here") lands here, said or unsaid.

   WHAT IT RENDERS (all read from CAFE in content.js):
     - the cafe scene as background (with a placeholder if the photo is absent)
     - the CAFE.intro line as a quiet, slow-fading overlay at the top
     - one figure per CAFE.selves[] entry, placed at its x,y%, tinted with its
       own life-stage color (so the three temperatures are visibly together)
     - clicking a self opens the SAME memory-card overlay used everywhere else,
       so the writing has one consistent voice on screen

   DESIGN NOTE: the cafe's own tint is "none" (neutral) — CLAUDE.md section 7:
   "cafe → neutral where all temperatures meet". Each SELF carries its own
   stage color via data-stage, so the convergence is felt as three temperatures
   sitting next to each other in one neutral room.
============================================================================ */

import { CAFE } from "./data/content.js";
import { openMemoryCard } from "./memoryCard.js";
import { assetPath } from "./assetPath.js";

/* ----------------------------------------------------------------------------
   renderCafe(app) — paint the cafe into the container.
---------------------------------------------------------------------------- */
export function renderCafe(app) {
  const view = document.createElement("div");
  view.className = "cafe-view";
  // "none" = neutral; per-self tints sit on top of this neutrality.
  view.dataset.stage = "none";

  // ---- 1. The cafe scene image (with a placeholder behind it). -------------
  const scene = document.createElement("div");
  scene.className = "cafe-scene";
  scene.appendChild(makePlaceholder(CAFE.name));
  if (CAFE.image) {
    const img = document.createElement("img");
    img.className = "scene-image";
    img.src = assetPath(CAFE.image);
    img.alt = CAFE.name;
    img.addEventListener("error", () => img.remove());
    scene.appendChild(img);
  }
  view.appendChild(scene);

  // ---- 2. The intro line — the temporal-collapse setup, slow-faded in. ----
  if (CAFE.intro) {
    const intro = document.createElement("p");
    intro.className = "cafe-intro";
    intro.textContent = CAFE.intro;
    view.appendChild(intro);
  }

  // ---- 3. The selves — every version of the narrator at one table. --------
  const selves = document.createElement("div");
  selves.className = "cafe-selves";
  (CAFE.selves || []).forEach((self, i) => {
    selves.appendChild(makeSelfFigure(self, i));
  });
  view.appendChild(selves);

  // ---- 4. Chrome: back to map + nameplate (same controls as a room view). --
  const chrome = document.createElement("div");
  chrome.className = "room-chrome";
  chrome.innerHTML = `
    <a class="back-button" href="#map" aria-label="Back to the map">
      <span aria-hidden="true">&larr;</span> Back to the map
    </a>
    <div class="room-nameplate">
      <span class="room-name">${CAFE.name}</span>
    </div>
  `;
  view.appendChild(chrome);

  app.appendChild(view);
}

/* ----------------------------------------------------------------------------
   makeSelfFigure(self, index) — one figure at the table.

   A "self" is a circular portrait (or labeled placeholder) tinted with that
   self's stage color, plus a small name label below. Clicking it opens the
   memory card with that self's caption — the "final word" from that age.
---------------------------------------------------------------------------- */
function makeSelfFigure(self, index) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cafe-self";
  btn.dataset.stage = self.stage || "none";
  btn.style.left = `${self.x}%`;
  btn.style.top = `${self.y}%`;
  // Stagger the rise of each self so they arrive at the table in sequence,
  // not all at once. Calm, not bouncy.
  btn.style.animationDelay = `${0.5 + index * 0.45}s`;
  btn.setAttribute("aria-label", `Open the final word from ${self.title}`);

  const ageBit = self.age != null ? `, age ${self.age}` : "";
  btn.innerHTML = `
    <span class="self-portrait" data-stage="${self.stage || "none"}">
      <span class="placeholder">
        <span class="placeholder-label">photo: ${self.title}${ageBit}</span>
      </span>
    </span>
    <span class="self-label">${self.title}</span>
  `;

  // Real photo (if any) goes on top of the placeholder — see room.js for the
  // same pattern. onerror -> the photo removes itself, placeholder shows.
  if (self.photo) {
    const img = document.createElement("img");
    img.className = "self-photo";
    img.src = assetPath(self.photo);
    img.alt = self.title;
    img.addEventListener("error", () => img.remove());
    btn.querySelector(".self-portrait").appendChild(img);
  }

  // Reuse the SAME memory-card overlay as the rooms. We pass the self in
  // hotspot-shape (id/title/caption/photo/age) and a tiny room-shape that
  // only carries the stage so the card tints with this self's color.
  btn.addEventListener("click", () => {
    openMemoryCard(
      {
        id: self.id,
        title: self.title,
        caption: self.caption,
        photo: self.photo,
        age: self.age,
      },
      { stage: self.stage }
    );
  });

  return btn;
}

/* ----------------------------------------------------------------------------
   makePlaceholder(label) — same idea as room.js: a tinted, labeled stand-in
   shown behind any image so a missing photo can't break the scene.
---------------------------------------------------------------------------- */
function makePlaceholder(label) {
  const ph = document.createElement("div");
  ph.className = "placeholder";
  ph.innerHTML = `<span class="placeholder-label">${label}</span>`;
  return ph;
}
