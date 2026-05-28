/* ============================================================================
   cafe.js — the convergence / climax scene   (STUB — built in Phase 3)
   ----------------------------------------------------------------------------
   The cafe is the destination: the one scene where ALL versions of the
   narrator (8, 14, 18) appear at one table at the same time — the "temporal
   collapse" that the whole structure builds toward (CLAUDE.md sections 1 & 2).

   It is deliberately NOT built in Phase 1. This stub keeps the #cafe route
   alive so the router never lands on a blank screen, and points back to the
   map. The real layout (multiple selves at once) comes in Phase 3, driven by
   the CAFE object in content.js.
============================================================================ */

export function renderCafe(app) {
  const view = document.createElement("div");
  view.className = "stub-view";
  view.innerHTML = `
    <div class="stub-card">
      <h1 class="stub-title">The Cafe</h1>
      <p class="stub-note">
        The convergence scene &mdash; every age at one table &mdash; is built in
        a later phase.
      </p>
      <a class="back-button" href="#map">&larr; Back to the map</a>
    </div>
  `;
  app.appendChild(view);
}
