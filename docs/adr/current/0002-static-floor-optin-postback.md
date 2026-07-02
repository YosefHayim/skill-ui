# 0002 — Static floor, opt-in post-back island

**Status:** accepted (2026-07-02)

## Context

mcp-ui / MCP Apps (SEP-1865) own interactive-UI-over-the-protocol for hosts. skill-ui is a different animal: a local HTML file, where the actual choosing often already happens in the TUI. But some skills genuinely want an approve/adjust/flip decision back from the browser.

## Decision

A **static, beautiful render is the floor** — every template delivers full value with zero JS. Interactivity is an **opt-in island**: when a skill wants a verdict, it renders `interactive` and runs the `serve` post-back, which serves the page on an OS-assigned ephemeral port, collects one `Decision`, writes it, and exits. If no server is available, the page copies the decision to the clipboard to paste back.

## Consequences

- Reader-first: most renders are static and instant.
- **Never hang** — the server carries an idle timeout; a headless / non-TTY caller always reaches a decision via the fallback.
- The decision contract (`{ approved, flips, revisit, notes }`) is the stable seam between browser and agent; every interactive component carries a stable `data-id`.
