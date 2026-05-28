/* ============================================================================
   assetPath.js — make image paths work no matter where the site is hosted
   ----------------------------------------------------------------------------
   In content.js you write image paths from the site root, e.g. "/scenes/court.jpg".
   That is the natural way to write them. BUT when the site is deployed under a
   sub-folder (GitHub Pages serves this project at  /i-grew-up-here/ ), a path
   that starts with "/" would point at the wrong place (the domain root) and the
   image would 404.

   Vite tells us the correct prefix at runtime via import.meta.env.BASE_URL:
     - local dev (npm run dev):           "/"
     - production build (GitHub Pages):   "/i-grew-up-here/"   (from vite.config.js)

   assetPath() glues the two together so "/scenes/court.jpg" becomes the right
   URL in both cases. Use it ANY time you turn a content.js path into a real
   image src. You never have to think about hosting in content.js again.
============================================================================ */

export function assetPath(path) {
  if (!path) return path;
  // BASE_URL always ends in "/"; drop that trailing slash, then append the
  // content path (which starts with "/") to avoid a doubled "//".
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base + path;
}
