# 0009 — Packaging + dufflebag consumes planpage as a dependency

**Status:** accepted (2026-07-02)

## Context

planpage was extracted from a hand-rolled spike inside `dufflebag` (copy-paste `COMPONENTS.md` HTML + a vendored `serve-plan.mjs`). With the kit now a real, public, tested package, dufflebag's `planpage` skill should consume it as one SSOT instead of maintaining a divergent copy. The repo is public on GitHub but not yet on npm (shapes are still settling).

## Decision

Make planpage a proper installable package and consume it from dufflebag **as a dependency**:

- `package.json` already declares `bin` (`planpage`), `exports` (`. → dist`), and `files`. Add **`prepare: npm run build`** so a **git dependency** (`github:YosefHayim/planpage`) builds `dist/` on install — no npm publish required yet.
- `dufflebag/package.json` gains `"planpage": "github:YosefHayim/planpage"`; the skill's SKILL.md authors with `import { render, serve, TEMPLATES } from "planpage"` (or `pnpm exec planpage …`).
- dufflebag's `COMPONENTS.md` slims to a pointer; its vendored `serve-plan.mjs` is retired — planpage's `serve` owns the post-back now.
- Publish to npm (`planpage@x`) once the template/component shapes settle; the dep spec then flips from `github:` to a version range.

## Consequences

- One SSOT for the kit; dufflebag stops carrying hand-rolled HTML/JS.
- Git-dep install builds from source via `prepare`, so consumers get `dist/` without a publish step.
- The migration to npm later is a one-line dependency change, not a rewrite.
