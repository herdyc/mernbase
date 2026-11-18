# Comparing the four rungs

Numbers come from `node scripts/metrics.mjs` (see `metrics.json`). "JS shipped" is the gzipped JavaScript a first visit downloads; for TanStack it counts every client chunk, so it's an upper bound.

## At a glance

| | 1 · Vanilla | 2 · Astro | 3 · MERN | 4 · TanStack Start |
| --- | --- | --- | --- | --- |
| Source files | 2 | 8 | 24 | 9 |
| Lines of code | 205 | 262 | 707 | 320 |
| JS shipped (gzip) | 2.1 KB | 11.5 KB | 68.3 KB | 109.7 KB |
| Build step | none | `astro build` | `tsc` + `vite build` | `vite build` |
| Who renders the HTML | the browser, by hand | your machine, at build | the browser (React) | the server, per request |
| Where tasks live | one browser | one browser | MongoDB | server file → database |
| Accounts | – | – | ✓ | exercise |
| Processes to run | 0 | 0 | 2 (API + client) | 1 |
| Hosting | any static host | any static host | Node host + static host | Node host |

## Same feature, four ways: "add a task"

| Rung | What happens when you click **Add** |
| --- | --- |
| 1 | Read the form, push to the `tasks` array, `localStorage.setItem`, call `render()` to rebuild the list. |
| 2 | Same data flow, but `setTasks()` tells Preact to update the page; saving happens in a `useEffect`. |
| 3 | `fetch("POST /api/tasks")` → Express validates with zod → Mongoose saves with your user id → JSON back → React updates. Loading and error states appear. |
| 4 | Call `createTask()` directly; Start turns it into an HTTP request for you. `useOptimistic` shows it instantly; `router.invalidate()` reloads the real list. |

## When would you actually pick each?

- **Vanilla**: a single small page, a widget, a prototype, or when learning. Nothing to install, nothing to break.
- **Astro**: content-heavy sites (blogs, docs, portfolios, marketing) with a few interactive parts. Fastest pages per KB.
- **MERN**: when the API is a product of its own (a mobile app or other teams will use it too), or a team splits front-end and back-end work.
- **TanStack Start**: an app where most pages need data and you want one codebase, one deploy and type safety from database to button.

## What each rung costs you

- **Vanilla**: you write the rendering yourself; it gets messy as the UI grows.
- **Astro**: interactive state across many islands needs extra work; the island framework is a second mental model.
- **MERN**: two apps, two deploys, an API contract kept in sync by hand, CORS and cookies to understand.
- **TanStack Start**: the most JavaScript shipped, and a framework that moves fast (APIs change between versions).
