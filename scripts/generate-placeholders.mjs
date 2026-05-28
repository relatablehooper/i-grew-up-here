/* ============================================================================
   scripts/generate-placeholders.mjs
   ----------------------------------------------------------------------------
   Run with:  npm run placeholders

   WHAT IT DOES
   Reads every room (and the cafe) from src/data/content.js and writes a simple
   labeled gradient JPEG to each one's image path under /public. That means the
   whole tour is walkable end-to-end with ZERO real photos — exactly what
   CLAUDE.md section 6 asks for. The gradient uses each room's STAGE color, so
   even the placeholders carry the right "temperature" for that life-stage.

   WHY A BUILD SCRIPT (and why sharp)
   The website itself stays 100% static and dependency-free at runtime. Image
   files have to be real raster bytes (a browser will not decode an SVG served
   as a .jpg), so we rasterize a small SVG into a JPEG with `sharp`. `sharp` is
   a DEV dependency only — it never ships to the browser. This is the one extra
   tool, and it only runs when you type `npm run placeholders`.

   SAFE TO RE-RUN
   It will NOT overwrite an image that already exists (so it can never clobber a
   real photo you dropped in). Pass --force to regenerate everything anyway.
============================================================================ */

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { ROOMS, CAFE, STAGES } from "../src/data/content.js";

// Where is the project root, and where do public assets live?
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");

// --force regenerates even images that already exist.
const FORCE = process.argv.includes("--force");

/* ----------------------------------------------------------------------------
   Small color helpers — mix a #rrggbb hex toward black/white by a 0–1 amount,
   so we can build a two-tone gradient from a single stage color.
---------------------------------------------------------------------------- */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function mix(hex, target, amount) {
  // target: 0 = black, 255 = white. amount: 0 = original, 1 = full target.
  const { r, g, b } = hexToRgb(hex);
  const f = (c) => Math.round(c + (target - c) * amount);
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

// Escape text so it is safe to drop inside SVG/XML.
function xml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ----------------------------------------------------------------------------
   buildSvg() — a tinted gradient with the room name and a small caption.
---------------------------------------------------------------------------- */
function buildSvg({ title, subtitle, color, width, height }) {
  const c1 = mix(color, 0, 0.15); // lighter top-left (toward the stage color)
  const c2 = mix(color, 0, 0.7); // darker bottom-right
  const bigFont = Math.round(width * 0.045);
  const smallFont = Math.round(width * 0.018);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <rect x="${width * 0.03}" y="${height * 0.05}" width="${width * 0.94}" height="${height * 0.9}"
        fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <text x="50%" y="49%" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="${bigFont}"
        fill="rgba(255,255,255,0.95)">${xml(title)}</text>
  <text x="50%" y="49%" dy="${bigFont * 0.95}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${smallFont}"
        letter-spacing="3" fill="rgba(255,255,255,0.6)">${xml(subtitle)}</text>
</svg>`;
}

/* ----------------------------------------------------------------------------
   writeImage() — rasterize the SVG to a JPEG at the given /public path.
---------------------------------------------------------------------------- */
async function writeImage(imagePath, opts) {
  // imagePath is like "/scenes/court.jpg" -> public/scenes/court.jpg
  const outPath = join(PUBLIC, imagePath.replace(/^\//, ""));

  // Skip existing files unless --force, so we never overwrite real photos.
  if (!FORCE) {
    try {
      await access(outPath);
      console.log(`  · skip (exists)   ${imagePath}`);
      return;
    } catch {
      /* file doesn't exist — go ahead and create it */
    }
  }

  await mkdir(dirname(outPath), { recursive: true });
  const svg = buildSvg(opts);
  await sharp(Buffer.from(svg)).jpeg({ quality: 78 }).toFile(outPath);
  console.log(`  ✓ wrote           ${imagePath}`);
}

/* ----------------------------------------------------------------------------
   Collect everything that needs a placeholder image: every room, plus the cafe.
---------------------------------------------------------------------------- */
function collectTargets() {
  const targets = [];

  for (const room of ROOMS) {
    if (!room.image) continue;
    const stage = STAGES[room.stage];
    const isPano = room.type === "pano";
    targets.push({
      image: room.image,
      title: room.name,
      // subtitle: stage + ages, and a note for 360 rooms.
      subtitle: [stage ? `${stage.label} · ${stage.ages}` : "entrance", isPano ? "360°" : "placeholder"]
        .join("  —  ")
        .toUpperCase(),
      color: stage ? stage.color : "#8d8678",
      // Panoramas are equirectangular: a 2:1 image. Scenes are landscape.
      width: isPano ? 2048 : 1600,
      height: isPano ? 1024 : 1000,
    });
  }

  // The cafe scene (its view is a Phase-3 stub, but the path is referenced).
  if (CAFE?.image) {
    targets.push({
      image: CAFE.image,
      title: CAFE.name,
      subtitle: "CONVERGENCE  —  PLACEHOLDER",
      color: "#8d8678", // neutral: where all the temperatures meet
      width: 1600,
      height: 1000,
    });
  }

  return targets;
}

/* ----------------------------------------------------------------------------
   Main.
---------------------------------------------------------------------------- */
async function main() {
  const targets = collectTargets();
  console.log(`\nGenerating ${targets.length} placeholder image(s) into /public ...\n`);

  for (const t of targets) {
    await writeImage(t.image, t);
  }

  console.log(`\nDone. Run "npm run dev" and the whole tour is walkable.\n`);
}

main().catch((err) => {
  console.error("Placeholder generation failed:\n", err);
  process.exit(1);
});
