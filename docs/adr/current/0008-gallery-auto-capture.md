# 0008 — Gallery auto-capture: registry SSOT + codegen + sync test

**Status:** accepted (2026-07-02)

## Context

The "library-ui" wants to show *everything* in the collection, captured automatically so a new component is never silently left out. Options weighed: a hand-kept registry only (easy to forget), a filesystem-scan codegen only (truly hands-off but effectful, and the pure render then depends on a generated file), or both.

## Decision

**Both** — a hand-annotated SSOT plus a drift guard:

- `src/gallery/registry.tsx` — the `GALLERY` object is the SSOT: one entry per showcase component with `blurb` · `usage` · `props` · a live `sample()`. Hand-annotated, because blurbs and good samples are editorial.
- `src/gallery/capture.ts` — **pure** logic: `componentNames(files)` and `diffRegistry(onDisk, registered)`. No I/O.
- `src/gallery/registry.test.ts` — the **enforced** guarantee: reads `src/components/`, and fails if the registry has drifted (`gallery-sync`).
- `skill-ui capture` (the CLI edge) — reads the dir, runs the pure diff, and prints a paste-ready stub for any missing component.

Infra components (`Shell`, `SubmitBar`) are excluded via a small `DENY` list — they are page scaffolding, not showcase items.

## Consequences

- The gallery is provably complete (the test fails on drift), yet the entries stay editorial (you write the blurb/sample).
- The pure render never imports a generated file — only the hand-written registry; the scan lives at the test + CLI edges.
- Keys of `GALLERY` must equal `src/components/*.tsx` minus `DENY` — that invariant is the whole mechanism.
