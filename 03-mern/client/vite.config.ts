import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, the browser talks only to Vite (port 5173).
    // Vite forwards /api/* to Express (port 5000), so cookies and requests
    // stay on one origin and we don't need CORS while developing.
    proxy: { "/api": "http://localhost:5000" },
  },
});
