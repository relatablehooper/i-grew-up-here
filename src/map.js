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

import { PROJECT, STAGES, ROOMS, CAFE } from "./data/content.js";
import { isVisited } from "./visited.js";

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

  // Build one marker per room — EXCEPT rooms flagged `intro: true`. The
  // entrance is its own guided beat at #intro; it shouldn't appear as a
  // free-explore option on the map.
  for (const room of ROOMS) {
    if (room.intro) continue;
    plan.appendChild(createRoomMarker(room));
  }

  // The cafe is its own kind of place — the destination, not just another
  // room — so it gets a visually distinct marker (see createCafeMarker).
  if (CAFE) {
    plan.appendChild(createCafeMarker(CAFE));
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

  // If the reader has already opened this room, mark it so the stylesheet
  // adds a subtle tint underline beneath the label — like a margin note.
  if (isVisited(room.id)) marker.dataset.visited = "true";

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
   createCafeMarker(cafe) — the cafe's marker on the floor-plan.

   Deliberately styled different from a stage room: a bullseye dot in ink (no
   stage color, because the cafe is where all temperatures meet) and an italic
   serif label. It reads as "the place this map points toward."
---------------------------------------------------------------------------- */
function createCafeMarker(cafe) {
  const marker = document.createElement("a");
  marker.className = "cafe-marker";
  marker.href = "#cafe";
  marker.style.left = `${cafe.map.x}%`;
  marker.style.top = `${cafe.map.y}%`;
  if (isVisited(cafe.id)) marker.dataset.visited = "true";
  marker.setAttribute("aria-label", `Enter ${cafe.name}`);
  marker.innerHTML = `
    <span class="cafe-marker-dot" aria-hidden="true"></span>
    <span class="cafe-marker-label">${cafe.name}</span>
  `;
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
