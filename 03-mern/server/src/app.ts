// The Express app, WITHOUT starting it. Keeping "build the app" separate from
// "listen on a port" lets the tests import the app and send it fake requests.
import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { tasksRouter } from "./routes/tasks.js";
import { errorHandler } from "./middleware/errors.js";
import { config } from "./config.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "10kb" })); // parse JSON bodies (replaces body-parser)
  app.use(cookieParser());

  // In development the React dev server proxies /api to us, so the browser
  // sees one origin and needs no CORS. In production, allow only our client.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin === config.CLIENT_ORIGIN) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
      if (req.method === "OPTIONS") return res.status(204).end();
    }
    next();
  });

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  app.use(errorHandler); // must be registered last
  return app;
}
