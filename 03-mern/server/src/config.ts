// All environment variables are read and checked in ONE place.
// If something is missing, the server refuses to start with a clear message
// instead of failing later in a confusing way.
import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  MONGO_URI: z.string().min(1, "MONGO_URI is required (see .env.example)"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  PORT: z.coerce.number().default(5000),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  NODE_ENV: z.string().default("development"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment:\n" + parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n"));
  process.exit(1);
}

export const config = parsed.data;
export const isProduction = config.NODE_ENV === "production";
