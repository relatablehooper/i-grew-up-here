/* ============================================================================
   room.js — THE ROOM VIEW (one room at a time)
   ----------------------------------------------------------------------------
   Given a room id (from the URL, e.g. #room/court), this renders that single
   room and the clickable "hotspots" floating inside it. Clicking a hotspot
   opens a memory card (memoryCard.js) — a vignette about one younger version
   of the narrator.

   A room is drawn one of two ways, chosen by room.type in content.js:
     - 'scene' : a flat photo of the room (a normal image)
     - 'pano'  : a 360° panorama, viewed with Pannellum (loaded only when used)

   GUARANTEE (CLAUDE.md section 6): the engine NEVER breaks on a missing image.
   If a room photo is absent or fails to load, we draw a clean labeled
   placeholder tinted with the stage's color, so the tour is always walkable.

   Everything is data-driven from content.js — this file knows nothing about
   the actual story; it just lays out whatever rooms and hotspots it is given.
============================================================================ */

import { ROOMS, STAGES } from "./data/content.js";
import { openMemoryCard } from "./memoryCard.js";
import { assetPath } from "./assetPath.js";

/* ----------------------------------------------------------------------------
   renderRoom(app, roomId) — paint one room into the container.
---------------------------------------------------------------------------- */
export function renderRoom(app, roomId) {
  // Look the room up by id. find() returns undefined if there is no match.
  const room = ROOMS.find((r) => r.id === roomId);

  // Unknown / mistyped id: don't crash, just guide the reader back to the map.
  if (!room) {
    app.appendChild(renderNotFound(roomId));
    return;
  }

  // Outer view. data-stage drives the per-stage color tint via CSS.
  const view = document.createElement("div");
  view.className = "room-view";
  view.dataset.stage = room.stage || "none";

  // The scene/pano fills the view; hotspots and the back button sit on top.
  if (room.type === "pano") {
    view.appendChild(renderPano(room));
  } else {
    // Default to a flat scene if type is anything other than 'pano'
    // (CLAUDE.md section 5: "Default to 'scene' if unsure.").
    view.appendChild(renderScene(room));
  }

  // The wayfinding controls (back to map + room name) sit above everything.
  view.appendChild(renderRoomChrome(room));

  app.appendChild(view);
}

/* ----------------------------------------------------------------------------
   renderScene(room) — a flat-photo room. The image fills the area; hotspots
   are positioned over it by percentage (hotspot.x / hotspot.y, 0–100).
---------------------------------------------------------------------------- */
function renderScene(room) {
  const scene = document.createElement("div");
  scene.className = "scene";
  scene.dataset.stage = room.stage || "none";

  // Behind everything: a labeled placeholder. It is always present, so if the
  // real photo is missing or fails to load, the reader still sees something
  // tidy (the room's name) instead of a broken-image icon.
  scene.appendChild(makePlaceholder(room.name));

  // The real photo (if any). We add it on TOP of the placeholder. If it loads,
  // it hides the placeholder; if it 404s, onerror removes it and the
  // placeholder shows through.
  if (room.image) {
    const img = document.createElement("img");
    img.className = "scene-image";
    img.src = assetPath(room.image);
    img.alt = room.name;
    img.addEventListener("error", () => img.remove());
    scene.appendChild(img);
  }

  // Lay the hotspots over the scene.
  for (const hotspot of room.hotspots || []) {
    scene.appendChild(makeSceneHotspot(room, hotspot));
  }

  return scene;
}

/* ----------------------------------------------------------------------------
   makeSceneHotspot(room, hotspot) — a clickable point over a flat scene.
   We use a <button> so it is keyboard-focusable and screen-reader friendly.
---------------------------------------------------------------------------- */
function makeSceneHotspot(room, hotspot) {
  const btn = document.createElement("button");
  btn.className = "hotspot";
  btn.type = "button";

  // Position by percentage; CSS centers it on the point with a transform.
  btn.style.left = `${hotspot.x}%`;
  btn.style.top = `${hotspot.y}%`;

  // The title doubles as the accessible label (alt text), per CLAUDE.md s.7.
  btn.setAttribute("aria-label", hotspot.title);
  btn.innerHTML = `
    <span class="hotspot-ring" aria-hidden="true"></span>
    <span class="hotspot-title">${hotspot.title}</span>
  `;

  // Clicking surfaces the memory card for this hotspot.
  btn.addEventListener("click", () => openMemoryCard(hotspot, room));

  return btn;
}

/* ----------------------------------------------------------------------------
   renderPano(room) — a 360° room, drawn with Pannellum.

   Pannellum is loaded LAZILY (only the first time a pano room is opened), so
   readers who only visit flat-scene rooms never download it. This honours
   CLAUDE.md: "Pannellum ... loaded only when a room's type is 'pano'."

   PANO HOTSPOT COORDS: for pano rooms, hotspot.x is the YAW (left–right angle,
   in degrees) and hotspot.y is the PITCH (up–down angle, in degrees) — that is
   the format Pannellum expects.
---------------------------------------------------------------------------- */
function renderPano(room) {
  // Pannellum needs a plain container to mount into. We give it a unique id.
  const mount = document.createElement("div");
  mount.className = "pano";
  mount.id = `pano-${room.id}`;

  // Show a placeholder until (and unless) the panorama is ready.
  mount.appendChild(makePlaceholder(room.name));

  // Translate our hotspots into Pannellum's hotSpot format.
  const hotSpots = (room.hotspots || []).map((hotspot) => ({
    pitch: hotspot.y,
    yaw: hotspot.x,
    cssClass: "pano-hotspot",
    // Pannellum calls this when the hotspot is clicked.
    clickHandlerFunc: () => openMemoryCard(hotspot, room),
    // Render the hotspot's title as its label inside the panorama.
    createTooltipFunc: (el) => {
      el.classList.add("pano-hotspot-tooltip");
      el.textContent = hotspot.title;
    },
  }));

  // Kick off the (async) Pannellum load + init. We don't await it here because
  // renderPano must return the element synchronously for the router.
  loadPannellum()
    .then((pannellum) => {
      try {
        pannellum.viewer(mount.id, {
          type: "equirectangular",
          panorama: assetPath(room.image),
          autoLoad: true,
          showControls: true,
          hotSpots,
        });
        // Pannellum injects its own canvas; clear our placeholder once mounted.
        const ph = mount.querySelector(".placeholder");
        if (ph) ph.remove();
      } catch (err) {
        // If init fails for any reason, the placeholder simply stays visible.
        console.warn("Pannellum init failed; showing placeholder.", err);
      }
    })
    .catch((err) => {
      console.warn("Pannellum failed to load; showing placeholder.", err);
    });

  return mount;
}

/* ----------------------------------------------------------------------------
   loadPannellum() — fetch Pannellum's CSS + JS from a CDN exactly once.
   Returns a promise that resolves with window.pannellum.
---------------------------------------------------------------------------- */
let pannellumPromise = null;
function loadPannellum() {
  // Already loaded or loading? Reuse the same promise (don't add it twice).
  if (pannellumPromise) return pannellumPromise;

  pannellumPromise = new Promise((resolve, reject) => {
    // Stylesheet first.
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(css);

    // Then the library script.
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.onload = () => resolve(window.pannellum);
    script.onerror = () => reject(new Error("Could not load Pannellum from CDN"));
    document.head.appendChild(script);
  });

  return pannellumPromise;
}

/* ----------------------------------------------------------------------------
   renderRoomChrome(room) — the on-top UI: a "back to map" link and the room
   name + stage tag. Kept separate from the scene so it floats above hotspots.
---------------------------------------------------------------------------- */
function renderRoomChrome(room) {
  const chrome = document.createElement("div");
  chrome.className = "room-chrome";

  // The stage label (e.g. "Play · 8–12"), if this room belongs to a stage.
  const stage = room.stage ? STAGES[room.stage] : null;
  const stageTag = stage
    ? `<span class="room-stage-tag" data-stage="${room.stage}">${stage.label} · ${stage.ages}</span>`
    : "";

  chrome.innerHTML = `
    <a class="back-button" href="#map" aria-label="Back to the map">
      <span aria-hidden="true">&larr;</span> Back to the map
    </a>
    <div class="room-nameplate">
      <span class="room-name">${room.name}</span>
      ${stageTag}
    </div>
  `;

  return chrome;
}

/* ----------------------------------------------------------------------------
   makePlaceholder(label) — a clean labeled stand-in shown when there is no
   real image yet (CLAUDE.md section 6). The gradient color comes from the
   surrounding element's data-stage via CSS, so it matches the stage.
---------------------------------------------------------------------------- */
function makePlaceholder(label) {
  const ph = document.createElement("div");
  ph.className = "placeholder";
  ph.innerHTML = `<span class="placeholder-label">${label}</span>`;
  return ph;
}

/* ----------------------------------------------------------------------------
   renderNotFound(roomId) — friendly fallback for an unknown room id.
---------------------------------------------------------------------------- */
function renderNotFound(roomId) {
  const view = document.createElement("div");
  view.className = "room-view not-found";
  view.innerHTML = `
    <div class="not-found-card">
      <p>There is no room called <strong>${roomId || "(nothing)"}</strong> here.</p>
      <a class="back-button" href="#map">&larr; Back to the map</a>
    </div>
  `;
  return view;
}
