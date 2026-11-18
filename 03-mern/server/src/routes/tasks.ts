import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { TaskModel, toClient } from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

export const tasksRouter = Router();
tasksRouter.use(requireAuth); // every route below needs a signed-in user

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be YYYY-MM-DD");
const createTask = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  due: dateString.nullable().optional(),
});
const updateTask = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    due: dateString.nullable(),
    done: z.boolean(),
  })
  .partial();

// GET /api/tasks  → this user's tasks, oldest first
tasksRouter.get("/", async (req, res) => {
  const tasks = await TaskModel.find({ owner: req.userId }).sort({ createdAt: 1 });
  res.json({ tasks: tasks.map(toClient) });
});

// POST /api/tasks  { title, due? }
tasksRouter.post("/", async (req, res) => {
  const input = createTask.parse(req.body);
  const task = await TaskModel.create({ ...input, owner: req.userId });
  res.status(201).json({ task: toClient(task) });
});

// PATCH /api/tasks/:id  { title?, due?, done? }
tasksRouter.patch("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Task not found" });
  const changes = updateTask.parse(req.body);
  // Filtering by owner as well as id is what stops user A editing user B's task.
  const task = await TaskModel.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, changes, {
    new: true,
    runValidators: true,
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ task: toClient(task) });
});

// DELETE /api/tasks/:id
tasksRouter.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Task not found" });
  const result = await TaskModel.deleteOne({ _id: req.params.id, owner: req.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Task not found" });
  res.status(204).end();
});
