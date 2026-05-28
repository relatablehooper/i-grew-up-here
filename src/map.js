/* ============================================================================
   map.js — THE MAP HUB (the explorable floor-plan)
   ----------------------------------------------------------------------------
   This is the heart of the project's FORM. There is no fixed reading order:
   the reader sees the whole building at once and chooses which room to enter,
   in any order. That free, non-linear exploration is itself one of the
   post-modern devices the assignment is graded on (CLAUDE.md section 2:
   "Non-linear, fragmented narrative — reader chooses path").

   WHAT THIS FILE DOES:
   For every room in ROOMS (from content.js), it drops a labeled, clickable
   marker onto a floor-plan, positioned using that room's map.{x,y} as a
   percentage. Click a marker -> the URL becomes #room/<id> -> the router
   (main.js) shows that room.

   It reads everything from content.js. To move a room on the map, the student
   changes map.x / map.y in content.js — never this file.
============================================================================ */

import { PROJECT, STAGES, ROOMS } from "./data/content.js";

/* ----------------------------------------------------------------------------
   renderMap(app) — paint the whole hub into the given container element.
---------------------------------------------------------------------------- */
export function renderMap(app) {
  // The outer view fills the screen and holds the header + the floor-plan.
  const view = document.createElement("div");
  view.className = "map-view";

  // ---- Header: the title block, styled like a blueprint's title corner. ----
  const header = document.createElement("header");
  header.className = "map-header";
  header.innerHTML = `
    <h1 class="map-title">${PROJECT.title}</h1>
    <p class="map-subtitle">${PROJECT.subtitle}</p>
    <p class="map-hint">Pick any room, in any order. There is no wrong path.</p>
  `;
  view.appendChild(header);

  // ---- The floor-plan canvas. Every marker is positioned inside this. -------
  // It is a positioned box; each room marker uses left/top percentages, so the
  // layout scales with the screen and matches the map.x / map.y in content.js.
  const plan = document.createElement("div");
  plan.className = "floorplan";

  // Build one marker per room.
  for (const room of ROOMS) {
    plan.appendChild(createRoomMarker(room));
  }

  view.appendChild(plan);

  // ---- Legend: maps each stage's color to its life-stage + ages. -----------
  // This helps a reader (and the teacher) feel the three life-stages as colors.
  view.appendChild(createLegend());

  app.appendChild(view);
}

/* ----------------------------------------------------------------------------
   createRoomMarker(room) — one clickable node on the floor-plan.

   We use an <a href="#room/<id>"> so it is:
     - keyboard-navigable for free (Tab + Enter), good for accessibility
     - handled by our hash router automatically (no extra click code needed)
---------------------------------------------------------------------------- */
function createRoomMarker(room) {
  const marker = document.createElement("a");
  marker.className = "room-marker";
  marker.href = `#room/${room.id}`;

  // data-stage lets the stylesheet tint this marker with the stage's color
  // (var(--stage-play) etc., published from content.js in main.js).
  marker.dataset.stage = room.stage || "none";

  // Position the marker by its map coordinates (percentages of the floor-plan).
  // translate(-50%,-50%) in CSS centers the marker exactly on that point.
  marker.style.left = `${room.map.x}%`;
  marker.style.top = `${room.map.y}%`;

  // A small dot + the room's name. The dot is the "you could go here" point;
  // the label is the hand-annotated wayfinding text.
  marker.innerHTML = `
    <span class="room-dot" aria-hidden="true"></span>
    <span class="room-label">${room.name}</span>
  `;

  // Accessible name for screen readers / good alt-style labeling.
  marker.setAttribute("aria-label", `Enter ${room.name}`);

  return marker;
}

/* ----------------------------------------------------------------------------
   createLegend() — the small color key, built from STAGES in content.js.
---------------------------------------------------------------------------- */
function createLegend() {
  const legend = document.createElement("div");
  legend.className = "map-legend";

  // One row per stage, each swatch tinted with that stage's color variable.
  const rows = Object.entries(STAGES)
    .map(
      ([name, stage]) => `
        <li class="legend-item" data-stage="${name}">
          <span class="legend-swatch" aria-hidden="true"></span>
          <span class="legend-text">${stage.label}<span class="legend-ages"> · ${stage.ages}</span></span>
        </li>`
    )
    .join("");

  legend.innerHTML = `<ul class="legend-list">${rows}</ul>`;
  return legend;
}
