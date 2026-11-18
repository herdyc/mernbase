# Rung 1 — Vanilla HTML, CSS and JavaScript

The Study Planner with **no framework, no build step and no server**. Open `index.html` in a browser and it runs.

## Run it

```bash
# any static server works; this one needs no install
npx serve .
# or just double-click index.html
```

## What this rung teaches

| Idea | Where to look |
| --- | --- |
| The DOM: building elements with `createElement` | `renderTask()` in `app.js` |
| Events and **event delegation** (one listener for many items) | the `list.addEventListener("click", …)` block |
| State → render loop: change data, then redraw | `update()` |
| Saving data in the browser | `load()` / `save()` with `localStorage` |
| Safe output: `textContent`, never `innerHTML` with user input | `renderTask()` |
| Native form validation (`required`, `maxlength`) | `index.html` |

## Files

```
01-vanilla/
├── index.html    the page structure
├── planner.css   shared styles (identical in every rung)
└── app.js        state, render, events (~190 lines)
```

## Limits you will feel (and why the next rungs exist)

- **Redrawing by hand.** `render()` rebuilds the whole list on every change. Fine for 20 tasks; slow and fiddly for 2,000.
- **One page.** Add a second page (say, a stats page) and you copy the header and styles by hand. → *Astro fixes this with components and layouts.*
- **Data lives in one browser.** Clear your storage or switch laptops and your tasks are gone. → *MERN adds a server and a database.*

## Exercises (do these without AI)

Work through them in order. Each has a check so you know you're done.

1. **Clear completed.** Add a "Clear done" button that deletes all finished tasks.
   *Check:* finish two tasks, click it, only unfinished tasks remain after a page refresh.
2. **Sort by due date.** Tasks with a due date come first, earliest at the top; tasks without one go last.
   *Check:* add three tasks with different dates in random order and confirm the order.
3. **Overdue highlight.** Give a task the class `overdue` when its due date is before today and it isn't done. Add one CSS rule for it.
   *Check:* a task due yesterday is highlighted; ticking it removes the highlight.
4. **Remember the filter.** Keep the chosen filter after a refresh.
   *Hint:* it's the same pattern as `save()`, with a different key.
5. **Stretch: undo delete.** After deleting, show "Task deleted · Undo" for 5 seconds.
   *Hint:* keep the deleted task and its index in a variable; `setTimeout` clears it.

**Rule of thumb for this rung:** if you're tempted to reach for a library, first write the 10 lines yourself. That's the point.
