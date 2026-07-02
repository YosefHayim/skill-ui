# 0006 — vitest, assertion/snapshot, co-located

**Status:** accepted (2026-07-02)

## Context

The render layer is pure (data → HTML string), which is ideal to test by rendering and asserting on the output. Options: vitest (first-class TS/JSX, snapshots), node:test (zero-dep, weaker JSX/snapshot ergonomics), or bun test.

## Decision

**vitest**, tests **co-located** beside source (`BeforeAfter.test.tsx`). Assert on the rendered HTML string (doctype, content present, `data-id`s, escaping, that boundary asserts throw); reach for `toMatchInlineSnapshot` where whole-output regression coverage pays. A `vitest.config.ts` sets the Preact JSX transform (`esbuild.jsxImportSource: "preact"`). Effectful `server`/`cli` get integration coverage as they grow.

## Consequences

- Pure templates are trivially tested with zero disk; regressions in output are caught cheaply.
- One more dev dependency than node:test, bought back by JSX + snapshot ergonomics.
