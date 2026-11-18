import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Static output: every page is turned into plain HTML at build time.
// Only components marked with a client:* directive ship JavaScript.
export default defineConfig({
  integrations: [preact()],
});
