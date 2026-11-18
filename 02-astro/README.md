# Rung 2 — Astro

The same Study Planner, now built from **components** with **Astro**. Most of the site is plain HTML generated at build time; only the planner itself ships JavaScript (an *island*).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # writes static files to dist/
npm run preview    # serves dist/
```

## What this rung adds on top of rung 1

| New idea | Where to look | Rung 1 equivalent |
| --- | --- | --- |
| **Layouts**: one header for every page | `src/layouts/Base.astro` | copy-pasted HTML |
| **Components** with props | `src/components/TaskItem.tsx` | `renderTask()` |
| **Declarative UI** (JSX): describe the UI, the library updates the page | `Planner.tsx` | `render()` + `replaceChildren()` |
| **Build-time rendering**: code that runs once on your machine, not in the browser | frontmatter in `src/pages/tips.astro` | none |
| **Islands**: only interactive parts ship JS | `<Planner client:load />` in `index.astro` | everything ships JS |
| **Scoped CSS** | `<style>` in `Base.astro` | global CSS only |
| **TypeScript** types for tasks | `Task` in `TaskItem.tsx` | JSDoc comment |

## Files

```
02-astro/
├── astro.config.mjs        enables the Preact integration
└── src/
    ├── layouts/Base.astro  page shell + navigation
    ├── pages/              one file = one URL
    │   ├── index.astro     /       → the planner island
    │   └── tips.astro      /tips   → static, zero JS
    ├── components/
    │   ├── Planner.tsx     state + list (island)
    │   └── TaskItem.tsx    one task row
    ├── data/tips.json      content read at build time
    └── styles/planner.css  shared styles
```

## See it for yourself

1. Run `npm run build`, then open `dist/tips/index.html`: no `<script>` tag at all.
2. In `index.astro`, remove `client:load` and rebuild. The planner still *renders* (as HTML), but nothing is clickable: no JavaScript was shipped.
3. Open DevTools → Network on `/` and `/tips`. Compare how many `.js` files each page loads.

## Limits you will feel

- **Data is still in one browser** (`localStorage`). → *MERN adds a server and database.*
- **No users.** Everyone on a computer shares one list. → *MERN adds sign-up and login.*

## Exercises (do these without AI)

1. **Add a page.** Create `/about` that explains the Stack Ladder in two paragraphs, using `Base.astro`.
   *Check:* the nav link highlights on `/about`, and the page ships no JS.
2. **Tip of the day.** On `/tips`, highlight one tip chosen at build time.
   *Check:* the choice changes only when you rebuild, not when you refresh. Explain why in one sentence.
3. **Extract a component.** Move the filter buttons out of `Planner.tsx` into `Filters.tsx` with props `value` and `onChange`.
   *Check:* the app behaves exactly the same.
4. **`client:visible`.** Make a small "Pomodoro timer" island at the bottom of `/` that only loads its JS when scrolled into view.
   *Check:* in the Network tab, its JS file appears only after you scroll.
5. **Stretch: content collection.** Move each tip into its own Markdown file and render them with Astro content collections.
