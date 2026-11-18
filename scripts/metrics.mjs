#!/usr/bin/env node
// Measures every rung so the comparison uses real numbers, not opinions.
// Usage: build the rungs first (see README), then `node scripts/metrics.mjs`.
// Writes docs/metrics.json and prints a Markdown table.
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { gzipSync } from "node:zlib";

const root = new URL("..", import.meta.url).pathname;

// Hand-written source only: skip dependencies, build output, generated files
// and the shared stylesheet (identical everywhere, so it isn't a difference).
const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".output", ".tanstack", "data", "public", "test"]);
const SKIP_FILES = new Set(["planner.css", "routeTree.gen.ts", "package-lock.json", "README.md"]);
const SOURCE_EXT = new Set([".html", ".js", ".mjs", ".ts", ".tsx", ".astro", ".css", ".json"]);

function sourceFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || SKIP_FILES.has(name) || name.startsWith(".")) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...sourceFiles(path));
    else if (SOURCE_EXT.has(extname(name))) out.push(path);
  }
  return out;
}

const lines = (files) =>
  files.reduce((n, f) => n + readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).length, 0);

/** Gzipped size of the JavaScript files a fresh visit to "/" downloads. */
function shippedJs(files) {
  const existing = files.filter(existsSync);
  if (existing.length === 0) return null;
  const bytes = existing.reduce((n, f) => n + gzipSync(readFileSync(f)).length, 0);
  return Math.round(bytes / 102.4) / 10; // KB, one decimal
}

function jsIn(dir) {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => join(dir, f)) : [];
}

const rungs = [
  {
    id: "vanilla",
    name: "1 · Vanilla HTML/CSS/JS",
    dir: "01-vanilla",
    js: () => [join(root, "01-vanilla/app.js")],
    rendering: "Client-side, by hand (DOM APIs)",
    data: "localStorage (one browser)",
    accounts: "No",
    deploy: "Any static host (e.g. GitHub Pages)",
    buildStep: "None",
  },
  {
    id: "astro",
    name: "2 · Astro",
    dir: "02-astro",
    js: () => jsIn(join(root, "02-astro/dist/_astro")),
    rendering: "Static HTML at build time + one island",
    data: "localStorage (one browser)",
    accounts: "No",
    deploy: "Any static host (e.g. Vercel)",
    buildStep: "astro build",
  },
  {
    id: "mern",
    name: "3 · MERN",
    dir: "03-mern",
    js: () => jsIn(join(root, "03-mern/client/dist/assets")),
    rendering: "Client-side SPA (React) + JSON API",
    data: "MongoDB (any device)",
    accounts: "Yes (bcrypt + JWT cookie)",
    deploy: "API on Render + client on Vercel",
    buildStep: "tsc + vite build",
  },
  {
    id: "tanstack",
    name: "4 · TanStack Start",
    dir: "04-tanstack",
    js: () => jsIn(join(root, "04-tanstack/dist/client/assets")),
    rendering: "Server-side rendered, then hydrated",
    data: "Server file (swap for a database)",
    accounts: "No (exercise)",
    deploy: "One Node app (e.g. Vercel, Render)",
    buildStep: "vite build",
  },
];

const results = rungs.map((r) => {
  const files = sourceFiles(join(root, r.dir));
  return {
    id: r.id,
    name: r.name,
    files: files.length,
    linesOfCode: lines(files),
    jsShippedKbGzip: shippedJs(r.js()),
    rendering: r.rendering,
    data: r.data,
    accounts: r.accounts,
    deploy: r.deploy,
    buildStep: r.buildStep,
  };
});

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/metrics.json"), JSON.stringify({ generatedAt: new Date().toISOString(), rungs: results }, null, 2) + "\n");

const fmt = (v) => (v === null ? "build first" : `${v} KB`);
console.log("| Rung | Source files | Lines of code | JS shipped (gzip) | Rendering | Data | Accounts |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
for (const r of results) {
  console.log(`| ${r.name} | ${r.files} | ${r.linesOfCode} | ${fmt(r.jsShippedKbGzip)} | ${r.rendering} | ${r.data} | ${r.accounts} |`);
}
