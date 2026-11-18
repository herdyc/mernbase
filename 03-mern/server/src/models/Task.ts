import { Schema, model, Types, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    // Every task belongs to one user. Every query filters by this field,
    // so one user can never read or change another user's tasks.
    owner: { type: Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    due: { type: String, default: null }, // "YYYY-MM-DD" or null
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = model("Task", taskSchema);

/** The shape the API sends to the client: same fields as rungs 1 and 2. */
export function toClient(doc: { _id: Types.ObjectId; title: string; due?: string | null; done: boolean; createdAt: Date }) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    due: doc.due ?? null,
    done: doc.done,
    createdAt: doc.createdAt.toISOString(),
  };
}
