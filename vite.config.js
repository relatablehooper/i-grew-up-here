import { defineConfig } from "vite";

/* ----------------------------------------------------------------------------
   Vite config — intentionally tiny. Vite needs almost no setup for a plain
   HTML + ES-modules site like this one.

   `base` is the public path the site is served from. The ONLY thing you change
   if you ever rename the repo or move hosts:
     - GitHub Pages at  relatablehooper.github.io/REPO-NAME/  -> "/REPO-NAME/"
     - Vercel / Netlify (their own domain/subdomain)          -> "/"

   We only apply the repo path for a production BUILD. The local dev server
   (`npm run dev`) always stays at "/" so http://localhost:5173/ just works.
---------------------------------------------------------------------------- */
const REPO_NAME = "i-grew-up-here";

export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${REPO_NAME}/` : "/",
}));
