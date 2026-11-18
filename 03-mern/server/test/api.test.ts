// Integration tests: a real (in-memory) MongoDB and real HTTP requests,
// without starting a server on a port.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import type { Express } from "express";

let mongo: MongoMemoryServer;
let app: Express;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.JWT_SECRET = "test-secret-at-least-16-chars";
  // Import AFTER setting env, because config.ts reads it on import.
  const { createApp } = await import("../src/app.js");
  await mongoose.connect(mongo.getUri());
  app = createApp();
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

beforeEach(async () => {
  await mongoose.connection.db?.dropDatabase();
});

/** Signs up and returns an agent that keeps the login cookie between requests. */
async function signedInAgent(email = "student@example.com") {
  const agent = request.agent(app);
  await agent.post("/api/auth/signup").send({ email, password: "correct-horse-42" }).expect(201);
  return agent;
}

describe("auth", () => {
  it("signs up, reads /me, logs out", async () => {
    const agent = await signedInAgent();
    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.email).toBe("student@example.com");
    await agent.post("/api/auth/logout").expect(204);
    await agent.get("/api/auth/me").expect(401);
  });

  it("never returns the password hash", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "a@example.com", password: "correct-horse-42" });
    expect(JSON.stringify(res.body)).not.toContain("passwordHash");
  });

  it("rejects duplicate emails, short passwords and wrong passwords", async () => {
    await signedInAgent("dup@example.com");
    await request(app).post("/api/auth/signup").send({ email: "DUP@example.com", password: "correct-horse-42" }).expect(409);
    await request(app).post("/api/auth/signup").send({ email: "b@example.com", password: "short" }).expect(400);
    const wrong = await request(app).post("/api/auth/login").send({ email: "dup@example.com", password: "wrong-password" }).expect(401);
    expect(wrong.body.error).toBe("Email or password is incorrect");
  });

  it("logs in with the right password", async () => {
    await signedInAgent("c@example.com");
    await request(app).post("/api/auth/login").send({ email: "c@example.com", password: "correct-horse-42" }).expect(200);
  });
});

describe("tasks", () => {
  it("requires sign-in", async () => {
    await request(app).get("/api/tasks").expect(401);
  });

  it("creates, lists, updates and deletes", async () => {
    const agent = await signedInAgent();
    const created = await agent.post("/api/tasks").send({ title: "Read chapter 3", due: "2026-12-01" }).expect(201);
    const id = created.body.task.id;
    expect(created.body.task).toMatchObject({ title: "Read chapter 3", due: "2026-12-01", done: false });

    const list = await agent.get("/api/tasks").expect(200);
    expect(list.body.tasks).toHaveLength(1);

    const updated = await agent.patch(`/api/tasks/${id}`).send({ done: true, title: "Read chapter 4" }).expect(200);
    expect(updated.body.task).toMatchObject({ done: true, title: "Read chapter 4" });

    await agent.delete(`/api/tasks/${id}`).expect(204);
    expect((await agent.get("/api/tasks")).body.tasks).toHaveLength(0);
  });

  it("validates input", async () => {
    const agent = await signedInAgent();
    await agent.post("/api/tasks").send({ title: "   " }).expect(400);
    await agent.post("/api/tasks").send({ title: "x", due: "next tuesday" }).expect(400);
    await agent.patch("/api/tasks/not-an-id").send({ done: true }).expect(404);
  });

  it("keeps each user's tasks private", async () => {
    const alice = await signedInAgent("alice@example.com");
    const bob = await signedInAgent("bob@example.com");
    const { body } = await alice.post("/api/tasks").send({ title: "Alice's task" }).expect(201);

    expect((await bob.get("/api/tasks")).body.tasks).toHaveLength(0);
    await bob.patch(`/api/tasks/${body.task.id}`).send({ done: true }).expect(404);
    await bob.delete(`/api/tasks/${body.task.id}`).expect(404);
    expect((await alice.get("/api/tasks")).body.tasks[0].done).toBe(false);
  });
});
