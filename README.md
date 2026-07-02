# planpage

Render a skill's plan, review-gate, or report as a beautiful, self-contained **local HTML** page — Preact components → static HTML, with an opt-in post-back server so the browser can hand a decision back to your agent. Like mcp-ui, but for local terminal skills.

Reader-first: the design center is the developer *reading* the plan.

## Install

```bash
npm install planpage
```

One name everywhere: the package, the `planpage` CLI command, and `import … from "planpage"`. `npx planpage` runs it with no install.

## Use (library)

```tsx
import { render, BeforeAfter } from "planpage";

const html = render(
  <BeforeAfter
    title="Deslop pass"
    diffs={[{ file: "src/x.ts", before: "let x = 1", after: "const x = 1" }]}
  />,
);
// write `html` to a temp file and open it
```

## Use (CLI)

```bash
planpage render before-after --sample --open                                 # preview from sample data
planpage render code-style-plan --data plan.json --serve --decision out.json # interactive gate
planpage new my-template                                                      # scaffold a template
planpage library --open                                                       # the living component gallery
planpage capture                                                              # check the gallery is in sync
planpage init                                                                 # add a ready skill to .claude/skills
planpage                                                                      # (in a TTY) interactive menu
```

Data goes in as JSON via `--data <file>` or piped stdin; `planpage render <template> --help` prints the shape.

## Use it in your agent

planpage is a package + CLI — **not itself a skill**. To make *your* agent render its plans through it:

1. **Install** — `npm i -D planpage` (or zero-install with `npx planpage`).
2. **Scaffold the skill** — `npx planpage init` drops a ready `render-plan` skill into `.claude/skills/` (`--global` for `~/.claude/skills`). It's wired to render + serve the plan and read the decision back.
3. **Ship it** — bundle that skill with your agent (or your own skills installer). End users install the *skill*; it depends on this package underneath.

The layers: **install the package → `init` a skill that calls it → ship that skill**. The generated skill is the injection point; planpage stays the engine.

## Templates

- **plan-brief** — a whole agent plan on one page: summary · notes · steps · options · risks · annotated code (the flagship).
- **before-after** — green/red before→after diffs (the workhorse report).
- **code-style-plan** — the pick-the-code gallery + canonical example + CLI flow (interactive gate).
- **library** — the living, auto-captured component gallery (`planpage library`).

## Components

Plan-native, reader-first pieces you compose into a page:

- **Notes** — `Callout` (note · warn · risk · decision · …), `RiskList` (severity-tagged tradeoffs).
- **Sequence** — `Steps`, `Timeline`, `StatusChip`.
- **Brainstorm** — `OptionCompare` (N-way pros/cons + verdict), `PickBlock` (✓ / ✗).
- **Metrics** — `PlanSummary` (blast-radius stats).
- **Code** — `CodeBlock`, `DiffBlock`, `AnnotatedCode` (inline rationale).
- **Layout** — `SectionCard`, `Accordion`, `TreePanel`, `Flow` (Mermaid).

Every component is showcased live in a searchable gallery (sticky category rail + type-to-filter) — run `planpage library --open`.

## How it works

`data → render() → HTML string → (write / open) OR (serve → one decision back)`. A static render is the floor; the post-back is opt-in and never hangs a non-TTY caller. Everything is self-contained (Tailwind + Mermaid from CDN); nothing is written to your repo.

## Docs

`PROJECT.md` (purpose) · `CONTEXT.md` (orientation) · `LANGUAGE.md` (glossary) · `CODE-STYLE.md` (how code is written) · `AGENTS.md` (working here) · `docs/adr/` (decisions).

## License

MIT
