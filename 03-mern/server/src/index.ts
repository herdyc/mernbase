import mongoose from "mongoose";
import { createApp } from "./app.js";
import { config } from "./config.js";

async function main() {
  // Connect FIRST, then start listening. The old mernbase started the server
  // before the database was ready, so early requests could fail.
  await mongoose.connect(config.MONGO_URI);
  console.log("Connected to MongoDB");

  const app = createApp();
  app.listen(config.PORT, () => console.log(`API listening on http://localhost:${config.PORT}`));
}

main().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
