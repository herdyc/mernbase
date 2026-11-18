import type { ReactNode } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import plannerCss from "../styles/planner.css?url";

// The root route is the HTML shell for every page. Because TanStack Start
// renders on the SERVER first, the browser receives finished HTML (with the
// tasks already in it), then React "hydrates" it to make it interactive.
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Study Planner — TanStack Start" },
    ],
    links: [{ rel: "stylesheet", href: plannerCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className="planner">
          <header>
            <h1>Study Planner</h1>
            <p className="tagline">Rung 4 · TanStack Start: one full-stack React project with server functions.</p>
          </header>
          {children}
        </main>
        <Scripts />
      </body>
    </html>
  );
}
