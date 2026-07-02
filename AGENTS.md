# AGENTS.md

Single source of truth for working in **skill-ui**. `CLAUDE.md` / `GEMINI.md` point here.

## What this is

**skill-ui** — a reusable, open-source kit that renders a skill's plan / gate / report as a beautiful, self-contained **local HTML** page. Reader-first: the design center is the developer *reading* the plan. Authored as **Preact components → static HTML** (`render(<Template {...data} />) → string`); a static render is the floor, an opt-in **post-back server** (`serve`) is the only interactivity. Clear of mcp-ui / MCP Apps (the protocol/host lane). Seeded by extracting the `skill-ui` spike from `dufflebag`, which becomes a thin consumer.

## Repo layout

| Path | Purpose |
|---|---|
| `src/components/` | shared primitives (flat) — `Shell`, `SectionCard`, `PickBlock`, `DiffBlock`, `TreePanel`, `Flow`, `CodeBlock`, `SubmitBar` |
| `src/templates/<Name>/` | gallery pages (folder-per-template: component + test + README); registry in `templates/index.tsx` |
| `src/render/` | pure engine — `render()`, `Shell` wiring, `raw()`, theme, client scripts |
| `src/server/` | opt-in post-back — `serve` (ephemeral port, never-hang), `Decision` |
| `src/cli/` | dual-mode CLI (commander) — `render` / `serve` / `new`; bare TTY → `menu` |
| `src/contracts/` | shared types — `Decision` |
| `src/index.ts` | public API barrel |
| `docs/adr/current/` | decisions (why) |
| `*.test.tsx` (co-located) | vitest, beside source |

## Conventions
<!-- rules digest — full guide in CODE-STYLE.md; edit there -->
- **Pure render, effects at the edges** — `components`/`templates`/`render` are pure (data → HTML string); all I/O in `server` + `cli`.
- **Components + `render()`** — Preact, arrow-const, named exports, PascalCase files, exported `readonly XProps`.
- **Escaping is default** — JSX auto-escapes; raw HTML only via `raw()`; `dangerouslySetInnerHTML` allowed only in `Shell` for constant infra.
- **Validate at the boundary** — public templates assert required props → actionable throw.
- **Errors by layer** — render throws · server exit codes (0/2/3, never-hang) · CLI top-catch.
- **Naming** — Comp `PascalCase` · props `XProps` · fns `camelCase` · consts `SCREAMING_SNAKE` · ids/flags `kebab-case`.
- **Tests** — vitest, snapshot/assertion-first, co-located.
- **Never** — micro-helpers (`isRecord`…), nested ternaries, generic names (`handleData`…), default exports, restyling the shell.
- **biome** is the one gate. **Reuse before create.** SSOT / KISS / YAGNI / DRY.

## Commands

```bash
npm run verify     # biome ci + tsc --noEmit + vitest  (the one gate)
npm run cli        # dual-mode CLI (bare = menu; -- <sub> = direct)
npm test           # vitest
npm run lint:fix   # biome check --write
npm run build      # tsc -p tsconfig.build.json → dist/
```

## Validate changes

From repo root: `npm run verify` must be green before shipping.

## Docs

`PROJECT.md` (purpose) · `CONTEXT.md` (orientation) · `LANGUAGE.md` (glossary) · `CODE-STYLE.md` (how code is written — SSOT; `deslop` enforces per-diff) · `docs/adr/` (decisions).
