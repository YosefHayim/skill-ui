# 0005 — commander, dual-mode, agent-first CLI

**Status:** accepted (2026-07-02)

## Context

Both humans and agents drive the CLI. Agents especially need to generate the HTML they want from arguments and discover options via `--help`. The surface must never hang a scripted caller.

## Decision

Use **commander** (richest auto-generated `--help`). Surface: `render <template>` (the agent's primary path — data via `--data <file>` or piped stdin; `--sample`, `--out`, `--open`, `--serve`, `--theme`), `serve <html> <out>` (post-back on an existing file), `new <name>` (scaffold a template). A **bare invocation in a TTY opens an interactive menu**; any flag or non-TTY stdin defers to commander and never prompts. `render <template> --help` advertises the template's data shape.

## Consequences

- Agents self-serve via `--help` and structured JSON; humans get a menu.
- One code path serves both audiences (the menu routes into the same command functions).
- node:util parseArgs was rejected: hand-built help would undercut the agent-discovery goal.
