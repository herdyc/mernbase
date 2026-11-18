# Rung 4 — TanStack Start

The Study Planner as **one full-stack React project**. Server code and UI code live side by side, the page is rendered on the server with the tasks already in it, and TypeScript checks the boundary between browser and server for you.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Tasks are saved to `data/tasks.json` on the server (git-ignored).

## What this rung adds on top of rung 3

| New idea | Where to look | Rung 3 equivalent |
| --- | --- | --- |
| **Server functions**: call server code like a normal function | `src/server/tasks.ts` | an Express route **plus** a fetch wrapper in `api.ts` |
| **End-to-end types**: the client knows what the server returns | `import { createTask } from "../server/tasks"` | types copied by hand |
| **File-based routing**: one file per URL | `src/routes/` | one page, no router |
| **Route loaders**: data fetched before the page renders | `loader: () => listTasks()` | `useEffect` + loading state |
| **Server-side rendering (SSR)**: HTML arrives with the tasks in it | view-source on `/` | empty `<div id="root">` |
| **`useOptimistic`** (React 19): instant UI, real data after | `mutate()` in `routes/index.tsx` | hand-written rollback |
| **`router.invalidate()`**: re-run loaders after a change | `mutate()` | manual state updates |

## Files

```
04-tanstack/
├── vite.config.ts          tanstackStart() plugin
└── src/
    ├── router.tsx          creates the router
    ├── routes/
    │   ├── __root.tsx      HTML shell for every page
    │   └── index.tsx       "/" → loader + planner UI
    ├── server/tasks.ts     server functions (list, create, update, delete)
    └── components/TaskItem.tsx
```

## See it for yourself

1. Run the app, add a task, then **View Page Source**. The task is in the HTML. Compare with rung 3, where the source is an empty `<div id="root">`.
2. Open DevTools → Network and tick a task. Find the request TanStack made for `updateTask`: you never wrote that URL.
3. In `index.tsx`, change `updateTask({ data: { id, changes: { done: "yes" } } })`. TypeScript flags it before you even run the app.

## Limits you will feel

- **No accounts.** Everyone shares one list. *(Exercise 3.)*
- **A JSON file isn't a database.** Two writes at the same moment can overwrite each other, and many hosts wipe local files on redeploy. *(Exercise 4.)*
- **One project = one deploy target** that must run Node. Rung 1 could be hosted anywhere as static files.

## Exercises (do these without AI)

1. **Second route.** Add `/stats` with its own loader returning `{ total, done, overdue }`. *Check:* the numbers are in the page source.
2. **Search params.** Store the filter in the URL (`/?filter=done`) using route `validateSearch`. *Check:* refreshing keeps the filter and the link is shareable.
3. **Add login.** Port the sign-up/login logic from rung 3 into server functions with an httpOnly cookie. Which file got simpler, and which got harder?
4. **Swap storage.** Replace the JSON file with SQLite or Postgres (Supabase). *Check:* only `src/server/tasks.ts` changes; the UI doesn't.
5. **Stretch: reflect.** Write half a page answering: for this app, which rung would you actually ship, and why?
