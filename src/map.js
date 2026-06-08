/* ============================================================================
   map.js — THE MAP HUB (illustrated 2D floor-plan)
   ----------------------------------------------------------------------------
   The whole site's form lives or dies on this view: a single screen where the
   reader sees the entire building at once and picks where to go. There is no
   fixed reading order, which is itself one of the post-modern devices the
   assignment is graded on (CLAUDE.md s.2: "Non-linear, fragmented narrative —
   reader chooses path").

   This is an INLINE SVG floor-plan — every line, every icon, every room
   outline is drawn at runtime. No raster images, no external assets. It
   scales perfectly on any screen and loads instantly.

   What is drawn:
     - An outdoor area (top-left) where the outdoor pool sits — visually
       outside the building outline.
     - The building outline as a dashed, slightly-imperfect rectangle (the
       Borges-y "labyrinth / permeable memory" feel — CLAUDE.md s.2 & s.7).
     - One room zone per room in content.js, positioned by the LAYOUT table
       below. Each zone has a tinted fill in its stage color, a serif label,
       and a tiny SVG icon (basketball hoop, dumbbell, wave, etc.).
     - A small pulsing dot on rooms the reader hasn't opened yet — "there
       is still something here for you." It stops pulsing once visited.

   Routing: each clickable room is wrapped in an SVG <a> with href="#room/<id>",
   so the existing hash-router (main.js) does all the navigation. Cafe routes
   to "#cafe". Entrance is shown for completeness but is not clickable — the
   entrance is the guided opening beat (#intro), not a free-explore room.

   The LAYOUT table below is the SVG's hand-designed coordinates. The room
   spatial hierarchy mirrors content.js's map.{x,y} (kids near entrance,
   weights upper-right, court center, outdoor-pool upper-left and outside the
   building), but the boxes are sized to feel like a real floor plan.
============================================================================ */

import { PROJECT, STAGES, ROOMS, CAFE } from "./data/content.js";
import { isVisited } from "./visited.js";

// SVG viewBox dimensions. The whole floor-plan is drawn into this coordinate
// space; the actual on-screen size is set by CSS (.floorplan-svg).
const VB_W = 1000;
const VB_H = 687;

/* ----------------------------------------------------------------------------
   LAYOUT — each room's rectangle on the floor-plan, in viewBox units.
   id          : matches the room id in content.js (or "cafe" for CAFE)
   x, y, w, h  : top-left corner + width/height
   icon        : which icon to draw inside the room (see makeIcon())
   outside     : if true, this room sits OUTSIDE the building outline
                 (only outdoor-pool right now)
---------------------------------------------------------------------------- */
const LAYOUT = {
  "outdoor-pool": { x: 70,  y: 40,  w: 240, h: 150, icon: "sun-wave", outside: true },
  "indoor-pool":  { x: 90,  y: 230, w: 240, h: 150, icon: "wave" },
  "sauna":        { x: 350, y: 230, w: 130, h: 110, icon: "sauna" },
  "weights":      { x: 580, y: 230, w: 330, h: 160, icon: "dumbbell" },
  "calisthenics": { x: 720, y: 410, w: 190, h: 110, icon: "pull-up" },
  "court":        { x: 490, y: 410, w: 220, h: 170, icon: "hoop" },
  "kids-academy": { x: 90,  y: 400, w: 240, h: 150, icon: "play" },
  "cafe":         { x: 350, y: 450, w: 130, h: 100, icon: "coffee" },
  "entrance":     { x: 340, y: 580, w: 320, h: 80,  icon: "door" },
};

// The building's interior bounding rectangle — covers every room except
// outdoor-pool. Padded a little so the walls sit OUTSIDE the room zones.
const BUILDING = { x: 65, y: 205, w: 870, h: 480 };

/* ----------------------------------------------------------------------------
   renderMap(app) — paint the whole hub into the container element.
---------------------------------------------------------------------------- */
export function renderMap(app) {
  const view = document.createElement("div");
  view.className = "map-view";

  // Title block — styled like the corner of a blueprint title sheet.
  const header = document.createElement("header");
  header.className = "map-header";
  header.innerHTML = `
    <h1 class="map-title">${PROJECT.title}</h1>
    <p class="map-subtitle">${PROJECT.subtitle}</p>
    <p class="map-hint">Pick any room, in any order. There is no wrong path.</p>
  `;
  view.appendChild(header);

  // The illustrated floor-plan itself.
  view.appendChild(buildFloorplan());

  // Stage-color legend (built from content.js STAGES).
  view.appendChild(buildLegend());

  app.appendChild(view);
}

/* ----------------------------------------------------------------------------
   buildFloorplan() — return a <div> containing the inline SVG.
---------------------------------------------------------------------------- */
function buildFloorplan() {
  const wrap = document.createElement("div");
  wrap.className = "floorplan";

  wrap.innerHTML = `
    <svg
      class="floorplan-svg"
      viewBox="0 0 ${VB_W} ${VB_H}"
      xmlns="http://www.w3.org/2000/svg"
      role="group"
      aria-label="Floor plan of the gym. Each labeled room opens that memory."
    >
      <defs>
        <!-- A whisper of paper grain over the whole floor-plan, so it reads
             as a drafting sheet rather than a flat SVG. -->
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>

      <!-- The outdoor area: a soft "outside" rectangle behind the outdoor pool,
           differentiated from the building so the reader feels the indoor /
           outdoor boundary at a glance. -->
      <g class="map-outdoor">
        <rect x="40" y="20" width="290" height="200" rx="8" class="outdoor-area"/>
        <text x="50" y="38" class="map-label-tiny">OUTDOOR</text>
      </g>

      <!-- Building outline. Dashed, so the walls feel like memory — incomplete,
           permeable. (The Borges nod from CLAUDE.md s.2.) -->
      <rect
        class="building-outline"
        x="${BUILDING.x}" y="${BUILDING.y}"
        width="${BUILDING.w}" height="${BUILDING.h}"
        rx="6"
      />

      ${renderAllRooms()}

      <!-- A small title block in the lower-left corner, blueprint-style. -->
      <g class="map-title-block">
        <line x1="40" y1="${VB_H - 38}" x2="220" y2="${VB_H - 38}" />
        <text x="40" y="${VB_H - 22}" class="map-label-tiny">LIFE TIME &middot; FIRST FLOOR</text>
        <text x="40" y="${VB_H - 8}"  class="map-label-tiny">DRAWN FROM MEMORY</text>
      </g>

      <!-- A very soft paper-grain overlay across the whole SVG. -->
      <rect x="0" y="0" width="${VB_W}" height="${VB_H}" filter="url(#paper-grain)" pointer-events="none"/>
    </svg>
  `;

  return wrap;
}

/* ----------------------------------------------------------------------------
   renderAllRooms() — return the SVG for every room zone, as one string.

   For each id in LAYOUT we look up the room in content.js (so the LABEL and
   STAGE come from there, not this file), and draw it. Cafe is special because
   it lives in CAFE (not ROOMS) and routes to "#cafe" instead of "#room/cafe".
---------------------------------------------------------------------------- */
function renderAllRooms() {
  const parts = [];

  for (const [id, layout] of Object.entries(LAYOUT)) {
    // Where do we look up this room's display data?
    const data =
      id === "cafe"
        ? { ...CAFE, stage: "none" } // cafe has no stage — it's neutral
        : ROOMS.find((r) => r.id === id);

    if (!data) continue; // safety: if content.js doesn't have it, skip

    parts.push(renderRoom(id, layout, data));
  }

  return parts.join("\n");
}

/* ----------------------------------------------------------------------------
   renderRoom(id, layout, data) — the SVG for one room zone.

   Most rooms route to "#room/<id>" via an SVG <a>. The cafe routes to
   "#cafe". The entrance is rendered for floor-plan completeness but is NOT
   wrapped in an <a> — it's reachable only through the guided #intro beat.
---------------------------------------------------------------------------- */
function renderRoom(id, layout, data) {
  const cx = layout.x + layout.w / 2;
  const cy = layout.y + layout.h / 2;
  const stage = data.stage || "none";
  const visited = isVisited(id) ? "true" : "false";

  // Pulse dot — only on rooms the reader hasn't opened yet. CSS hides it
  // once data-visited="true". Position: small dot near the room's label.
  const pulseDot = `<circle class="pulse-dot" cx="${layout.x + layout.w - 14}" cy="${layout.y + 14}" r="4"/>`;

  // The room zone itself: rectangle + label + icon. data-stage drives the
  // per-room tint via the stylesheet (CSS color-mix with var(--tint)).
  const inner = `
    <g class="room-zone" data-room="${id}" data-stage="${stage}" data-visited="${visited}">
      <rect
        class="room-rect"
        x="${layout.x}" y="${layout.y}"
        width="${layout.w}" height="${layout.h}"
        rx="4"
      />
      <text class="room-zone-label" x="${cx}" y="${layout.y + 22}" text-anchor="middle">
        ${escape(data.name)}
      </text>
      <g class="room-icon" transform="translate(${cx}, ${cy + 8})">
        ${makeIcon(layout.icon)}
      </g>
      ${id === "entrance" ? "" : pulseDot}
    </g>
  `;

  // Entrance: visible but not clickable (intro is its real route).
  if (id === "entrance") return inner;

  // Everything else routes via an SVG <a> — Tab + Enter just works, and the
  // hash router (main.js) takes it from there.
  const href = id === "cafe" ? "#cafe" : `#room/${id}`;
  const ariaLabel = `Enter ${data.name}${visited === "true" ? " (already visited)" : ""}`;
  return `<a href="${href}" aria-label="${escape(ariaLabel)}">${inner}</a>`;
}

/* ----------------------------------------------------------------------------
   makeIcon(name) — tiny SVG illustration for each room.

   Designed to read at small sizes: a few clean strokes, ink-on-paper feel.
   Centered around (0,0) — the calling code translates them into position.
---------------------------------------------------------------------------- */
function makeIcon(name) {
  switch (name) {
    case "hoop": // basketball hoop + backboard
      return `
        <rect x="-14" y="-12" width="22" height="3"/>
        <circle cx="-3" cy="-2" r="7" fill="none" stroke-width="1.6"/>
        <line x1="-7" y1="-2" x2="-5" y2="9" stroke-width="0.9"/>
        <line x1="-3" y1="-2" x2="-3" y2="10" stroke-width="0.9"/>
        <line x1="1"  y1="-2" x2="-1" y2="9" stroke-width="0.9"/>
        <line x1="4"  y1="-2" x2="2"  y2="8" stroke-width="0.9"/>
      `;

    case "dumbbell":
      return `
        <line x1="-14" y1="0" x2="14" y2="0" stroke-width="2.4"/>
        <rect x="-18" y="-6" width="5" height="12" rx="1"/>
        <rect x="13"  y="-6" width="5" height="12" rx="1"/>
      `;

    case "pull-up": // pull-up bar with two hands
      return `
        <line x1="-14" y1="-6" x2="14" y2="-6" stroke-width="2.2"/>
        <line x1="-14" y1="-8" x2="-14" y2="-2" stroke-width="2.2"/>
        <line x1="14"  y1="-8" x2="14"  y2="-2" stroke-width="2.2"/>
        <path d="M -6,-6 Q -6,-1 -4,2" fill="none" stroke-width="1.4"/>
        <path d="M 6,-6 Q 6,-1 4,2" fill="none" stroke-width="1.4"/>
      `;

    case "wave": // a couple of swimming-lane waves
      return `
        <path d="M -18,-2 Q -12,-8 -6,-2 T 6,-2 T 18,-2" fill="none" stroke-width="1.6"/>
        <path d="M -18,4  Q -12,-2 -6,4  T 6,4  T 18,4"  fill="none" stroke-width="1.6"/>
        <path d="M -18,10 Q -12,4  -6,10 T 6,10 T 18,10" fill="none" stroke-width="1.6"/>
      `;

    case "sun-wave": // outdoor pool: a sun above a wave
      return `
        <circle cx="0" cy="-8" r="4" fill="none" stroke-width="1.4"/>
        <line x1="0"  y1="-15" x2="0"  y2="-17" stroke-width="0.9"/>
        <line x1="-6" y1="-8"  x2="-9" y2="-8"  stroke-width="0.9"/>
        <line x1="6"  y1="-8"  x2="9"  y2="-8"  stroke-width="0.9"/>
        <line x1="-5" y1="-13" x2="-7" y2="-15" stroke-width="0.9"/>
        <line x1="5"  y1="-13" x2="7"  y2="-15" stroke-width="0.9"/>
        <path d="M -18,5 Q -12,-1 -6,5 T 6,5 T 18,5" fill="none" stroke-width="1.6"/>
      `;

    case "sauna": // cedar cabin with horizontal boards + small heater
      return `
        <rect x="-12" y="-10" width="24" height="18" fill="none" stroke-width="1.4"/>
        <line x1="-10" y1="-5" x2="10" y2="-5" stroke-width="0.7"/>
        <line x1="-10" y1="-1" x2="10" y2="-1" stroke-width="0.7"/>
        <line x1="-10" y1="3"  x2="10" y2="3"  stroke-width="0.7"/>
        <rect x="-4" y="-6" width="8" height="6" fill="currentColor"/>
      `;

    case "play": // a child's slide silhouette
      return `
        <path d="M -10,8 L -10,-6 L 6,-6 L 13,8 Z" fill="none" stroke-width="1.5"/>
        <line x1="-10" y1="-2" x2="-14" y2="-2" stroke-width="1"/>
        <line x1="-10" y1="2"  x2="-14" y2="2"  stroke-width="1"/>
        <circle cx="-2" cy="-2" r="2.4" fill="currentColor"/>
      `;

    case "coffee": // cup + handle + steam
      return `
        <path d="M -9,-6 L 9,-6 L 7,8 L -7,8 Z" fill="none" stroke-width="1.5"/>
        <path d="M 9,-3 Q 14,0 9,5" fill="none" stroke-width="1.5"/>
        <path d="M -3,-11 Q -2,-13 -3,-15" fill="none" stroke-width="1.2"/>
        <path d="M 3,-11  Q 4,-13  3,-15"  fill="none" stroke-width="1.2"/>
      `;

    case "door": // a doorway: rectangle with vertical center, arrow pointing in
      return `
        <rect x="-12" y="-10" width="24" height="20" fill="none" stroke-width="1.5"/>
        <line x1="0" y1="-10" x2="0" y2="10" stroke-width="0.8" stroke-dasharray="2 2"/>
        <path d="M 0,16 L -3,11 L 3,11 Z" fill="currentColor"/>
      `;

    default:
      return "";
  }
}

/* ----------------------------------------------------------------------------
   buildLegend() — the stage-color key, built from STAGES in content.js.
---------------------------------------------------------------------------- */
function buildLegend() {
  const legend = document.createElement("div");
  legend.className = "map-legend";
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

/* ----------------------------------------------------------------------------
   escape(s) — minimal HTML escape for safety when interpolating room names
   into the SVG / aria-label strings.
---------------------------------------------------------------------------- */
function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
