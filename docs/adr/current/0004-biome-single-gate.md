# 0004 — biome as the single format + lint gate

**Status:** accepted (2026-07-02)

## Context

A small TS/JSX library needs formatting + linting, including machine-prevention of the AI-slop fingerprint. Options: biome (one fast tool), biome + a tiny eslint, or prettier + eslint (max rule power, two tools, more config).

## Decision

**biome only** — format + lint in one tool, one `biome.json`, `biome ci` as the single CI gate. Double quotes, 100-col, trailing commas. Lint overrides: `noDefaultExport`, `noNonNullAssertion`, `useConst`, plus recommended (which covers `noDangerouslySetInnerHtml`, `noExplicitAny`, `noNestedTernary`). Semantic slop that a formatter can't catch (giveaway micro-helpers, generic names) is delegated to `deslop` per-diff.

## Consequences

- One fast gate, near-zero config; contributors run `npm run verify`.
- Config files that must default-export (e.g. `vitest.config.ts`) carry a scoped `biome-ignore`.
- Best-fit on its own merits, not because dufflebag also uses biome.
