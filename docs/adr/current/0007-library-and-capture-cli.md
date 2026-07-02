# 0007 — `library` + `capture` CLI commands

**Status:** accepted (2026-07-02)

## Context

The kit grew to ~15 components. Readers (and the skill authors wiring them) need to see what exists, how to call it, and what it looks like — without reading source. And a growing collection silently loses coverage: someone adds a component and forgets to show it anywhere.

## Decision

Two commands, both routed through the same `render()`/registry the rest of the CLI uses:

- **`planpage library`** — renders the `Library` template (the auto-captured gallery) to a self-contained page (`--out`, `--open`, `--theme`). `Library` is also registered as a template, so it appears in the bare-TTY menu and `render library` works too.
- **`planpage capture`** — a dev tool that reads `src/components/`, diffs it against the `GALLERY` registry, and prints a paste-ready stub for anything missing (`--check` exits non-zero for CI). It runs from source (where the `.tsx` files live); the enforced guarantee is the `gallery-sync` test.

The shared `openPath`/`writeTemp` effect helpers moved to `src/cli/io.ts` on `library` becoming their second consumer (reuse-before-create).

## Consequences

- Agents discover the whole kit from one page; humans get live previews + usage + props.
- The dual-mode contract holds — both commands defer to flags, never prompt off-TTY.
- `capture` is source-only by design; the CI-enforced check is the test, not the command.
