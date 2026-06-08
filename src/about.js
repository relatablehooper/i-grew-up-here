/* ============================================================================
   about.js — the "About this project" overlay
   ----------------------------------------------------------------------------
   A small modal that names the post-modern devices your form demonstrates
   (CLAUDE.md s.2: "A short 'About this project' overlay that names the devices
   is allowed and encouraged"). The teacher's rubric grades "clear examples of
   post-modern elements" — this overlay lets a marker SEE the list while they
   use the site, so the credit lands.

   The text is read entirely from content.js (PROJECT.aboutPostModern + the
   POSTMODERN_DEVICES list). To change the wording, edit content.js — never
   this file.

   Behaviour matches the memory card: backdrop click / × / Escape closes it,
   slow fade in and out, focus moves to the close button for accessibility.
============================================================================ */

import { PROJECT, POSTMODERN_DEVICES } from "./data/content.js";

/* ----------------------------------------------------------------------------
   openAbout() — show the About overlay.
---------------------------------------------------------------------------- */
export function openAbout() {
  // Never stack two overlays on top of each other.
  document.querySelector(".about-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "about-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "About this project");

  // Build the list of post-modern devices from content.js (may be empty if the
  // student deletes it — the overlay still renders, it just shows no list).
  const devicesHtml = (POSTMODERN_DEVICES || [])
    .map(
      (d) => `
        <li class="about-device">
          <span class="about-device-name">${d.name}</span>
          <span class="about-device-note">${d.note}</span>
        </li>`
    )
    .join("");

  overlay.innerHTML = `
    <div class="about-card">
      <button class="about-close" type="button" aria-label="Close">&times;</button>
      <h2 class="about-title">About this project</h2>
      <p class="about-text">${PROJECT.aboutPostModern}</p>
      ${
        devicesHtml
          ? `<h3 class="about-subtitle">Post-modern devices this site uses</h3>
             <ul class="about-devices">${devicesHtml}</ul>`
          : ""
      }
    </div>
  `;

  // Wire up every way to close.
  const close = () => closeAbout(overlay);
  overlay.querySelector(".about-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", onKey);
  overlay._onKey = onKey;

  document.body.appendChild(overlay);

  // Add .is-open on the next frame so the browser sees the start state first
  // and animates from transparent -> opaque (matches memoryCard.js's pattern).
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  overlay.querySelector(".about-close").focus();
}

/* ----------------------------------------------------------------------------
   closeAbout(overlay) — fade out and remove.
---------------------------------------------------------------------------- */
function closeAbout(overlay) {
  if (overlay._onKey) document.removeEventListener("keydown", overlay._onKey);
  overlay.classList.remove("is-open");
  overlay.addEventListener(
    "transitionend",
    () => overlay.remove(),
    { once: true }
  );
  // Safety net if the transition never fires.
  setTimeout(() => overlay.remove(), 1200);
}
