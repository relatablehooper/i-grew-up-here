/* ============================================================================
   main.js — app bootstrap + the hash router
   ----------------------------------------------------------------------------
   This is the "engine's front door". It does two jobs:

     1. Reads the URL hash (the bit after the # sign) and decides which view to
        show: the map, a room, the intro, or the cafe.
     2. Re-runs that decision every time the hash changes (i.e. every time the
        reader clicks a link that points to "#something").

   WHY A HASH ROUTER?
   The site is fully static (no server). A hash router lets us have real,
   shareable URLs like  yoursite.com/#room/court  without needing any backend
   to handle them — the browser never asks a server for "#room/court", it just
   tells our JavaScript, and we render the right thing. This keeps the whole
   project deployable to GitHub Pages / Vercel / Netlify with zero config.

   ROUTES (CLAUDE.md section 4):
     #intro        -> the opening "guided" beat            (stub until Phase 4)
     #map          -> the explorable floor-plan hub        (the core of the site)
     #room/<id>    -> one room, e.g. #room/kids-academy
     #cafe         -> the convergence climax               (stub until Phase 3)

   The engine reads ALL content from src/data/content.js. It never hardcodes
   story text. (CLAUDE.md section 4: "Separation of content and engine is sacred.")
============================================================================ */

import { STAGES } from "./data/content.js";
import { renderMap } from "./map.js";
import { renderRoom } from "./room.js";
import { renderIntro } from "./intro.js";
import { renderCafe } from "./cafe.js";
import { openAbout } from "./about.js";

// The single container in index.html that every view paints into.
const app = document.getElementById("app");

/* ----------------------------------------------------------------------------
   applyStageColors() — take the colors the student set in content.js (STAGES)
   and publish them as CSS custom properties on the root element, e.g.

       :root { --stage-play: #F2B441; --stage-performance: #3E78A0; ... }

   The stylesheet then tints each room with var(--stage-<name>). Doing it this
   way means the COLORS live in content.js (the student's file) while the DESIGN
   lives in CSS — change a stage's color by editing content.js, nothing else.
---------------------------------------------------------------------------- */
function applyStageColors() {
  for (const [name, stage] of Object.entries(STAGES)) {
    document.documentElement.style.setProperty(`--stage-${name}`, stage.color);
  }
}

/* ----------------------------------------------------------------------------
   parseHash() — turn the URL hash into a small { name, param } object.

   Examples:
     "#map"               -> { name: "map",  param: null }
     "#room/kids-academy" -> { name: "room", param: "kids-academy" }
     ""  (empty)          -> { name: "map",  param: null }   (our default)
---------------------------------------------------------------------------- */
function parseHash() {
  // Drop the leading "#", then split on "/" so "room/kids-academy" becomes
  // ["room", "kids-academy"].
  const raw = window.location.hash.replace(/^#/, "");
  const [name, param] = raw.split("/");

  // No hash yet? Send the reader to the INTRO — the one guided beat — so the
  // opening voice always lands first. The "Begin" CTA there moves them to #map
  // where free exploration takes over.
  if (!name) return { name: "intro", param: null };

  return { name, param: param || null };
}

/* ----------------------------------------------------------------------------
   router() — the heart of the engine. Looks at the current hash and renders
   the matching view into #app. Called once on load and again on every change.
---------------------------------------------------------------------------- */
function router() {
  const { name, param } = parseHash();

  // Clear whatever the previous view left behind before drawing the next one.
  app.innerHTML = "";

  // Always scroll back to the top when the view changes (feels like "entering").
  window.scrollTo(0, 0);

  switch (name) {
    case "map":
      renderMap(app);
      break;

    case "room":
      // param is the room id, e.g. "court". room.js handles an unknown id.
      renderRoom(app, param);
      break;

    case "intro":
      renderIntro(app); // stub for now (Phase 4)
      break;

    case "cafe":
      renderCafe(app); // stub for now (Phase 3)
      break;

    default:
      // Anything we don't recognise falls back to the map rather than a blank
      // screen — the engine should never leave the reader stranded.
      window.location.hash = "#map";
  }
}

// Publish the stage colors as CSS variables before the first paint.
applyStageColors();

// The "About this project" button is in index.html so it's always present.
// It opens an overlay listing the post-modern devices the form demonstrates —
// good for the teacher's check-in to see them named on screen.
document
  .getElementById("about-button")
  ?.addEventListener("click", () => openAbout());

// Run the router whenever the hash changes (a link click) ...
window.addEventListener("hashchange", router);
// ... and once right now, so the first paint happens on page load.
window.addEventListener("DOMContentLoaded", router);
