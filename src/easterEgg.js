/* ============================================================================
   easterEgg.js — small floating video overlay
   ----------------------------------------------------------------------------
   A tiny "moment from this room" — a clip pulled out of a pocket to show you,
   not a cinematic presentation. The video window is small (~40vw), centered,
   with a subtle border and drop-shadow. The label above is set in the
   project's serif, low opacity — a quiet caption.

   PLACEHOLDER BEHAVIOUR: if the video file isn't there yet, the overlay opens
   and the video element fires its 'error' event. We swap the video out for a
   "video coming soon" card in the same window. That way the FEATURE is fully
   visible and testable before Ayaan has filmed anything.

   Closing: backdrop click, the × button, or Escape.

   Triggered from room.js via openEasterEgg(easterEggVideo). The easterEggVideo
   object lives in content.js on the room (or null if no clip exists). Engine
   reads everything from there.
============================================================================ */

import { assetPath } from "./assetPath.js";

/* ----------------------------------------------------------------------------
   openEasterEgg(easterEggVideo) — show the video overlay.
     easterEggVideo : { src, label, triggerPosition }  (from content.js)
---------------------------------------------------------------------------- */
export function openEasterEgg(easterEggVideo) {
  // Only one overlay open at a time.
  document.querySelector(".easter-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "easter-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", easterEggVideo.label || "a moment from this room");

  // The small floating window — label + video + close.
  const card = document.createElement("div");
  card.className = "easter-card";
  card.innerHTML = `
    <button class="easter-close" type="button" aria-label="Close">&times;</button>
    <p class="easter-label">${escape(easterEggVideo.label || "a moment from this room")}</p>
    <div class="easter-frame"></div>
  `;
  overlay.appendChild(card);

  const frame = card.querySelector(".easter-frame");

  if (easterEggVideo.src) {
    // Build the video element. autoplay muted on open (browser policy allows
    // muted autoplay), and we surface a clear unmute button so the reader can
    // turn the sound on.
    const video = document.createElement("video");
    video.className = "easter-video";
    video.src = assetPath(easterEggVideo.src);
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    // If the file is missing or doesn't load, swap to the "coming soon" card.
    video.addEventListener("error", () => swapToComingSoon(frame));
    // If the metadata never loads (e.g. zero-byte file), same fallback.
    video.addEventListener("stalled", () => swapToComingSoon(frame));
    frame.appendChild(video);

    // Unmute button (large, visible, sits on the video).
    const unmute = document.createElement("button");
    unmute.className = "easter-unmute";
    unmute.type = "button";
    unmute.setAttribute("aria-label", "Unmute");
    unmute.textContent = "Unmute";
    unmute.addEventListener("click", () => {
      video.muted = !video.muted;
      unmute.textContent = video.muted ? "Unmute" : "Mute";
      unmute.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
    });
    frame.appendChild(unmute);
  } else {
    // No src configured at all — show the coming-soon card directly.
    swapToComingSoon(frame);
  }

  // --- All the close paths ------------------------------------------------
  const close = () => closeEasterEgg(overlay);
  card.querySelector(".easter-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    // Clicking the dim backdrop (but not the card) closes.
    if (e.target === overlay) close();
  });
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", onKey);
  overlay._onKey = onKey;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  card.querySelector(".easter-close").focus();
}

/* ----------------------------------------------------------------------------
   swapToComingSoon(frame) — replace the video with a "coming soon" card.
---------------------------------------------------------------------------- */
function swapToComingSoon(frame) {
  // Idempotent: if we already swapped, do nothing.
  if (frame.classList.contains("is-coming-soon")) return;
  frame.classList.add("is-coming-soon");
  frame.innerHTML = `<span class="easter-soon">video coming soon</span>`;
}

/* ----------------------------------------------------------------------------
   closeEasterEgg(overlay) — fade and remove.
---------------------------------------------------------------------------- */
function closeEasterEgg(overlay) {
  if (overlay._onKey) document.removeEventListener("keydown", overlay._onKey);
  // Pause any playing video so audio stops the moment we begin to close.
  overlay.querySelector("video")?.pause();
  overlay.classList.remove("is-open");
  overlay.addEventListener(
    "transitionend",
    () => overlay.remove(),
    { once: true }
  );
  setTimeout(() => overlay.remove(), 1200);
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
