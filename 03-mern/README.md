# Rung 3 — MERN (MongoDB, Express, React, Node)

The Study Planner with **a real server, a database and accounts**. Tasks now follow the user to any device, and each user only sees their own.

This rung replaces the original `mernbase` template (kept for reference in [`/legacy`](../legacy)).

## Run it

You need Node 20+ and a MongoDB database: either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or MongoDB installed locally.

```bash
npm run install:all
cp server/.env.example server/.env   # then fill in MONGO_URI and JWT_SECRET
npm run dev                          # API on :5000, React on http://localhost:5173
npm test                             # API tests (downloads a temporary MongoDB the first time)
```

## How the pieces talk

```
Browser (React, :5173) ──/api/*──▶ Vite dev proxy ──▶ Express (:5000) ──▶ MongoDB
        ▲                                                  │
        └────────── JSON + an httpOnly login cookie ◀──────┘
```

## What this rung adds on top of rung 2

| New idea | Where to look |
| --- | --- |
| **REST API**: URLs + HTTP methods (`GET/POST/PATCH/DELETE`) | `server/src/routes/tasks.ts` |
| **Database models** with Mongoose | `server/src/models/` |
| **Authentication**: hashed passwords (bcrypt) + signed tokens (JWT) | `server/src/routes/auth.ts`, `middleware/auth.ts` |
| **Authorisation**: every query filters by `owner`, so users can't touch each other's tasks | `routes/tasks.ts` |
| **Input validation** on the server (never trust the browser) | `zod` schemas in the routes |
| **Config from environment variables**, checked at startup | `server/src/config.ts` |
| **Network states** in the UI: loading, errors, optimistic updates | `client/src/components/Planner.tsx` |
| **Automated API tests** | `server/test/api.test.ts` |

## What changed from the old mernbase (and why)

| Before | Now | Why |
| --- | --- | --- |
| Auth controller and user model were empty files | Working sign-up, login, logout, `/me` | A template should work on day one |
| Create React App | Vite | CRA is deprecated; Vite starts in under a second |
| Server listened before MongoDB connected | Connect first, then listen | Early requests no longer fail |
| `body-parser` imported but not installed | `express.json()` | Built into Express |
| Placeholder `/api/model` route | Real `/api/tasks` resource | Shows a full CRUD pattern to copy |
| No tests | 8 API tests incl. "users can't see each other's tasks" | Tests are part of the template |
| `cors()` allowing every origin | Dev proxy; only `CLIENT_ORIGIN` allowed in production | Least privilege |

## API reference

| Method | Path | Body | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | `{ email, password }` | — |
| POST | `/api/auth/login` | `{ email, password }` | — |
| POST | `/api/auth/logout` | — | — |
| GET | `/api/auth/me` | — | ✓ |
| GET | `/api/tasks` | — | ✓ |
| POST | `/api/tasks` | `{ title, due? }` | ✓ |
| PATCH | `/api/tasks/:id` | `{ title?, due?, done? }` | ✓ |
| DELETE | `/api/tasks/:id` | — | ✓ |

## Deploy

- **API → Render** (Web Service): root `03-mern/server`, build `npm install && npm run build`, start `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`.
- **Client → Vercel**: root `03-mern/client`. Add a rewrite from `/api/:path*` to your Render URL so the browser still sees one origin and the cookie keeps working.

## Limits you will feel

- **Two apps to run, configure and deploy**, with an API contract between them that you keep in sync by hand (`client/src/api.ts` must match the routes). → *TanStack Start puts front and back end in one project with shared types.*

## Exercises (do these without AI)

1. **Read the tests first.** Run `npm test`, then break the owner check in `routes/tasks.ts` (remove `owner: req.userId` from the delete query). Which test fails, and why?
2. **Add a `notes` field** to tasks: model → validation → API → client. *Check:* notes survive a refresh and a re-login.
3. **Sort on the server.** Add `GET /api/tasks?sort=due` and use it from the client. Write a test first.
4. **Rate-limit login.** Block an email for 5 minutes after 5 wrong passwords. *Check:* write a test that proves it.
5. **Optimistic delete.** `toggle` is already optimistic (see the comment). Do the same for delete, with rollback on failure.
6. **Stretch: deploy it** to Render + Vercel using the steps above and send someone your link.
