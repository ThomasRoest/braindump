# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server
npm run build      # type-check + production build (tsc -b && vite build)
npm run lint       # run ESLint
npx tsc -b         # type-check only (faster than full build)
```

There are no tests.

## Architecture

Single-page React app — infinite canvas brainstorm tool (Miro-like). Two screens: boards overview and canvas.

**Routing:** `App.tsx` → react-router-dom. `/` = `BoardsOverview`, `/board/:id` = `CanvasPage`.

**State:** All board/card data lives in `src/store/boards.tsx` (React context + `useReducer`). State is initialised synchronously from localStorage via `useReducer`'s lazy initialiser — not a `useEffect` load. A save effect persists on every state change. `src/store/theme.tsx` manages dark mode by toggling `.dark` on `<html>`.

**Canvas:** `CanvasBoard.tsx` renders an absolutely-positioned zero-size div that gets `transform: translate(x,y) scale(s)` applied. Cards are `position: absolute` children within that div. Pan = drag on the background (mousedown propagation stops at cards). Zoom = non-passive `wheel` listener (re-registers on view change via `useEffect` deps). View state (pan/zoom) is kept in local state in `CanvasPage` and debounce-saved to the store — it does not live in context to avoid re-renders on every pan/zoom.

**Card system:** `CardWrapper.tsx` provides the drag handle bar, colour picker, delete button, and resize handle for all card types. Individual card components (`NoteCard`, `TodoCard`, `ImageCard`) handle only their own content. Cards update the store directly via `onUpdate` callbacks — drag/resize call `onUpdate` on every `mousemove`.

**Styling:** Tailwind v4 — no config file, imported via `@import "tailwindcss"` in `index.css`. Class-based dark mode is enabled with `@variant dark (&:where(.dark, .dark *))` in `index.css`. Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes. Canvas dot-grid background is a plain CSS class `.canvas-bg` in `index.css`.

**TypeScript:** `verbatimModuleSyntax` is enabled — always use `import type` for type-only imports.

**Types & validation:** `src/lib/boardSchema.ts` is the single source of truth — all TypeScript types are derived from Zod schemas via `z.infer<typeof ...>`. Never define types manually in `src/types/index.ts`; that file only re-exports from `boardSchema.ts`. When adding a new card type or field, update the schema in `boardSchema.ts` and the TypeScript type updates automatically. The `BoardSchema` is used to validate JSON on import (`BoardSchema.safeParse(...)`) — do not use `as Board` casts.

## Code style

- Arrow functions for everything including React components
- `import type` for all type imports
- `lucide-react` for icons, no inline SVGs
- `cn()` for conditional Tailwind classes (don't use it where there's no conditionality)
- No JSX comments unless they add real context (not `{/* Header */}` style labels)
- Do not randomly disable eslint warnings, there are there for a reason. Implement the correct fix.
