import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config, isProduction } from "../config.js";

export const COOKIE_NAME = "sp_token";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

// The token lives in an httpOnly cookie: JavaScript in the page can't read it,
// so a script injected into the page can't steal it. (Storing it in
// localStorage would be simpler, but readable by any script on the page.)
export function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, config.JWT_SECRET, { expiresIn: ONE_WEEK_SECONDS });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: ONE_WEEK_SECONDS * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: isProduction });
}

// Express doesn't know about our user, so we tell TypeScript about req.userId.
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

/** Blocks the request with 401 unless it carries a valid login cookie. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not signed in" });
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    clearAuthCookie(res);
    return res.status(401).json({ error: "Session expired, please sign in again" });
  }
}
