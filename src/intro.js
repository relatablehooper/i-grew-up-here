/* ============================================================================
   intro.js — the opening "guided" beat   (STUB — built in Phase 4)
   ----------------------------------------------------------------------------
   The intro is the ONE guided moment before the reader is set free to explore
   (CLAUDE.md sections 1 & 8). It is intentionally NOT built yet — Phase 1 is
   the walkable skeleton only.

   For now #intro just shows a short note and a way into the map, so the route
   exists and nothing breaks if someone navigates to it.
============================================================================ */

import { PROJECT } from "./data/content.js";

export function renderIntro(app) {
  const view = document.createElement("div");
  view.className = "stub-view";
  view.innerHTML = `
    <div class="stub-card">
      <h1 class="stub-title">${PROJECT.title}</h1>
      <p class="stub-note">The entrance scene arrives in a later phase.</p>
      <a class="back-button" href="#map">Enter the map &rarr;</a>
    </div>
  `;
  app.appendChild(view);
}
