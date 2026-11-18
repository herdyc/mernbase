import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import { clearAuthCookie, requireAuth, setAuthCookie } from "../middleware/auth.js";

export const authRouter = Router();

const credentials = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

// POST /api/auth/signup  { email, password }
authRouter.post("/signup", async (req, res) => {
  const { email, password } = credentials.parse(req.body);
  const exists = await UserModel.exists({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "An account with this email already exists" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ email, passwordHash });
  setAuthCookie(res, user.id);
  res.status(201).json({ user: { id: user.id, email: user.email } });
});

// POST /api/auth/login  { email, password }
authRouter.post("/login", async (req, res) => {
  const { email, password } = credentials.parse(req.body);
  const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  // Same message for "no such user" and "wrong password", so attackers can't
  // use this endpoint to find out which emails have accounts.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Email or password is incorrect" });
  }
  setAuthCookie(res, user.id);
  res.json({ user: { id: user.id, email: user.email } });
});

// POST /api/auth/logout
authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

// GET /api/auth/me  → who is signed in?
authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  res.json({ user: { id: user.id, email: user.email } });
});
