/* ============================================================================
   intro.js — the ENTRANCE / opening guided beat
   ----------------------------------------------------------------------------
   The whole site is non-linear, EXCEPT for this one screen. The intro is the
   single guided moment before the reader is set free to explore (CLAUDE.md
   sections 1 & 8). It establishes the voice and hands the reader the form:
   "pick a direction. you will meet one of them."

   The intro renders the room in ROOMS that you flagged with `intro: true` —
   currently "The Entrance". It shows the entrance image, the project title,
   the subtitle, the FIRST hotspot caption from that room as the literary
   opening, and a quiet CTA into the map.

   It is data-driven from content.js: edit the entrance room's first hotspot
   caption to rewrite the opening voice. The engine doesn't invent any words.
============================================================================ */

import { PROJECT, ROOMS } from "./data/content.js";
import { assetPath } from "./assetPath.js";

export function renderIntro(app) {
  // Find the room marked as the guided opening beat. Fall back to the first
  // room if the student removes the flag, so the intro never blanks out.
  const entrance = ROOMS.find((r) => r.intro) || ROOMS[0];
  const openingCaption = entrance?.hotspots?.[0]?.caption || "";

  const view = document.createElement("div");
  view.className = "intro-view";
  view.dataset.stage = entrance?.stage || "none";

  // ---- 1. The entrance image (with a placeholder behind it). --------------
  const scene = document.createElement("div");
  scene.className = "intro-scene";
  scene.appendChild(makePlaceholder(entrance?.name || PROJECT.title));
  if (entrance?.image) {
    const img = document.createElement("img");
    img.className = "scene-image";
    img.src = assetPath(entrance.image);
    img.alt = entrance.name || PROJECT.title;
    img.addEventListener("error", () => img.remove());
    scene.appendChild(img);
  }
  view.appendChild(scene);

  // ---- 2. The text block — title, subtitle, opening caption, CTA. ---------
  const block = document.createElement("div");
  block.className = "intro-block";
  block.innerHTML = `
    <h1 class="intro-title">${PROJECT.title}</h1>
    <p class="intro-subtitle">${PROJECT.subtitle}</p>
    ${
      openingCaption
        ? `<blockquote class="intro-caption">${openingCaption}</blockquote>`
        : ""
    }
    <a class="intro-cta" href="#map" aria-label="Begin exploring the map">
      Begin <span aria-hidden="true">&rarr;</span>
    </a>
  `;
  view.appendChild(block);

  app.appendChild(view);
}

/* Local placeholder helper — same shape as in room.js / cafe.js. Each view
   keeps its own copy so the file can be read end-to-end without jumping. */
function makePlaceholder(label) {
  const ph = document.createElement("div");
  ph.className = "placeholder";
  ph.innerHTML = `<span class="placeholder-label">${label}</span>`;
  return ph;
}
