/* ============================================================================
   visited.js — remember which rooms the reader has actually entered
   ----------------------------------------------------------------------------
   On the map, a thin tint-colored underline appears under the label of any
   room you have already opened — a small "you've been here" margin note,
   like marginalia in a book. It is meant to feel like the building gradually
   becomes YOURS as you wander it.

   Persistence is browser localStorage, so the annotations survive a refresh
   but stay private to the reader's own visit.

   READ by map.js (to draw the cues). WRITTEN by room.js and cafe.js (when a
   place is actually entered).
============================================================================ */

const KEY = "igrewup:visited";

// Read the stored set. Wrapped in try/catch so a private-browsing or
// localStorage-blocked browser never crashes the engine — it just behaves
// as if nothing has been visited yet.
function read() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function write(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* localStorage unavailable — fail quietly */
  }
}

/* Mark a room as visited. Safe to call repeatedly. */
export function markVisited(id) {
  if (!id) return;
  const set = read();
  set.add(id);
  write(set);
}

/* Has this room been visited yet? */
export function isVisited(id) {
  return read().has(id);
}
