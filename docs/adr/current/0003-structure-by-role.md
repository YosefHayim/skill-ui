# 0003 — Structure by role, hard pure/effect split

**Status:** accepted (2026-07-02)

## Context

planpage is a render library where templates compose shared components, plus an effectful server and CLI. A vertical-per-template layout would fight the heavy component sharing; a flat `src/` won't scale to "many templates."

## Decision

Group `src/` **by role**: `components/` (shared primitives, flat files) · `templates/<Name>/` (folder-per-template: component + test + README) · `render/` (pure engine) · `server/` (post-back) · `cli/` (dual-mode) · `contracts/` (shared types) · `index.ts` (public barrel). Enforce a **hard pure/effect split**: `components`/`templates`/`render` are pure (no `fs`/`net`/`process`/`Date`/`random`); all I/O lives in `server` + `cli`.

## Consequences

- The sharing is obvious; the gallery grows without reorganizing.
- The pure half is snapshot-testable with zero disk; the browser-opening, file-writing, port-binding server can never leak into the render path.
- Fit-for-purpose, decided fresh — not inherited from the sibling dufflebag repo.
