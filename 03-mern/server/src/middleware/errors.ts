import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/** Sends a clean 400 for bad input and a generic 500 for anything unexpected. */
// Express recognises an error handler by its four arguments, so `next` must stay.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues[0]?.message ?? "Invalid input" });
  }
  // Never send stack traces to the browser; log them on the server instead.
  console.error(err);
  return res.status(500).json({ error: "Something went wrong" });
}
