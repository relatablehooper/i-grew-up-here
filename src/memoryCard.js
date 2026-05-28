/* ============================================================================
   memoryCard.js — THE MEMORY CARD (the vignette overlay)
   ----------------------------------------------------------------------------
   When the reader clicks a hotspot in a room, this surfaces a single memory:
   a photo of a younger version of the narrator and the literary caption the
   student wrote for it. The caption is set in a serif typeface to signal
   "this is the writing — this is literature" (CLAUDE.md section 7).

   The age is shown subtly, because the quiet shock of the piece is realising
   how many different ages are hiding in one building.

   MOTION: a memory should SURFACE, not pop. The card fades in slowly and fades
   out slowly (CLAUDE.md section 7: "gentle, slow fades. No bouncy UI.").

   Like every other view, this reads its text from content.js (passed in as the
   `hotspot` object) and never invents content of its own.
============================================================================ */

/* ----------------------------------------------------------------------------
   openMemoryCard(hotspot, room) — show the vignette for one hotspot.
     hotspot : { id, x, y, photo, title, caption, age }  (from content.js)
     room    : the room it belongs to (used for the per-stage color tint)
---------------------------------------------------------------------------- */
export function openMemoryCard(hotspot, room) {
  // Only ever one card at a time — clear any previous one instantly.
  document.querySelector(".memory-card-backdrop")?.remove();

  // ---- Backdrop: a dim layer that covers the room behind the card. ----------
  const backdrop = document.createElement("div");
  backdrop.className = "memory-card-backdrop";
  // Tint inherits the room's stage so the card "feels" like the same time.
  backdrop.dataset.stage = room?.stage || "none";

  // ---- The card itself. ----------------------------------------------------
  const card = document.createElement("div");
  card.className = "memory-card";
  // role/aria so screen readers announce it as a dialog.
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-label", hotspot.title);

  // The age line, shown subtly (e.g. "age 8"). Omitted if no age is given.
  const ageLine =
    hotspot.age != null
      ? `<span class="memory-age">age ${hotspot.age}</span>`
      : "";

  card.innerHTML = `
    <button class="memory-close" type="button" aria-label="Close memory">&times;</button>

    <div class="memory-photo" data-stage="${room?.stage || "none"}">
      <div class="placeholder">
        <span class="placeholder-label">photo: ${hotspot.title}${
    hotspot.age != null ? `, age ${hotspot.age}` : ""
  }</span>
      </div>
    </div>

    <figure class="memory-figure">
      <figcaption class="memory-caption">${hotspot.caption}</figcaption>
      <div class="memory-meta">
        <span class="memory-title">${hotspot.title}</span>
        ${ageLine}
      </div>
    </figure>
  `;

  // Add the real photo (if any) on top of its placeholder. onerror -> the
  // placeholder shows through, so a missing photo never breaks the card.
  if (hotspot.photo) {
    const img = document.createElement("img");
    img.className = "memory-photo-img";
    img.src = hotspot.photo;
    img.alt = hotspot.title;
    img.addEventListener("error", () => img.remove());
    card.querySelector(".memory-photo").appendChild(img);
  }

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);

  // ---- Wire up every way to close the card. --------------------------------
  const close = () => closeMemoryCard(backdrop);

  // 1) the X button
  card.querySelector(".memory-close").addEventListener("click", close);

  // 2) clicking the dim backdrop (but not the card itself)
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  // 3) the Escape key
  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", onKey);
  // Remember the handler so we can remove it when the card closes.
  backdrop._onKey = onKey;

  // ---- Fade in. We add the .is-open class on the NEXT frame so the browser
  // registers the starting (transparent) state first and animates to it. -----
  requestAnimationFrame(() => backdrop.classList.add("is-open"));

  // Move keyboard focus to the close button for accessibility.
  card.querySelector(".memory-close").focus();
}

/* ----------------------------------------------------------------------------
   closeMemoryCard(backdrop) — fade the card out, then remove it from the page.
---------------------------------------------------------------------------- */
function closeMemoryCard(backdrop) {
  // Stop listening for Escape — we stored the handler when we opened the card.
  if (backdrop._onKey) {
    document.removeEventListener("keydown", backdrop._onKey);
  }

  // Trigger the fade-out (CSS transitions opacity back to 0).
  backdrop.classList.remove("is-open");

  // Remove the element only after the fade has finished, so the exit is smooth.
  backdrop.addEventListener(
    "transitionend",
    () => backdrop.remove(),
    { once: true }
  );

  // Safety net: if for some reason the transition never fires, remove anyway.
  setTimeout(() => backdrop.remove(), 1200);
}
