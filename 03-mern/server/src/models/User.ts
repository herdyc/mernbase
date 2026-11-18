import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // We store a bcrypt HASH, never the password itself.
    // select: false means queries leave it out unless we ask for it explicitly.
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
