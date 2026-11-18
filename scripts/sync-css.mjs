#!/usr/bin/env node
// Copies shared/planner.css into every rung, so all four look identical.
// Edit shared/planner.css, then run: node scripts/sync-css.mjs
import { copyFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const targets = [
  "01-vanilla/planner.css",
  "02-astro/src/styles/planner.css",
  "03-mern/client/src/planner.css",
  "04-tanstack/src/styles/planner.css",
];
for (const t of targets) {
  copyFileSync(`${root}shared/planner.css`, `${root}${t}`);
  console.log("updated", t);
}
