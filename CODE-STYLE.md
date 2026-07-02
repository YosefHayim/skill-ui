# CODE-STYLE.md

How code is written in **skill-ui**. Prescriptive. The rules digest is mirrored into `AGENTS.md`; this file is the source — edit here. `deslop` enforces it per-diff.

## Stack & framework practices

skill-ui is a JSX→static HTML render library (Preact) + a dual-mode CLI (commander) + an opt-in post-back server. For practices this file does **not** restate:

- writing / consuming skills → `write-a-skill`

Preact render-to-string has no house skill; the conventions below are the SSOT.

## Rules

Load-bearing, project-specific rules only. Each: a one-line rule + a **✓ chosen / ✗ rejected** pair + an enforcement tag (`[lint: rule]` if a linter catches it, else `[taste]`).

### Structure: by role · [taste]
`src/{components,templates,render,server,cli,contracts}`, public barrel `src/index.ts`. Shared primitives in `components/` (flat files); gallery pages in `templates/<Name>/` (folder-per-template: component + colocated test + README).
_Why:_ templates compose shared components — role grouping keeps the sharing obvious.

### Pure render, effects at the edges · [taste]
`components/` · `templates/` · `render/` are pure: data → HTML string, no `fs`/`net`/`process`/`Date`/`Math.random`. All I/O (write file, open browser, serve, read decision) lives in `server/` + `cli/`.
```tsx
// ✓ pure (src/components/DiffBlock.tsx)
export const DiffBlock = ({ before, after }: DiffBlockProps) => <pre>{before}{after}</pre>;
// ✗ effect inside render
export const DiffBlock = (p) => { writeFileSync(p.out, "…"); return <pre />; };
```
_Why:_ snapshot the pure half with zero disk; the server can never leak into the render path.

### Public contract: components + `render()` · [taste]
Templates and components are Preact components (named exports). The one boundary to a string is `render(<Template {...data} />): string`, which wraps the doc shell (CDN tags, light/dark theme).
```tsx
// ✓ render(<BeforeAfter {...data} />)  ->  self-contained HTML string
// ✗ beforeAfter(data): string          // hiding components behind a string fn (rejected)
```
_Why:_ composability — consumers build pages by nesting components.

### Validate skill-supplied data at the boundary · [taste]
A public template asserts its required props up top and throws an actionable `Error`. No schema lib; hand guards.
```tsx
if (diffs.length === 0) throw new Error("BeforeAfter: diffs[] is required and non-empty");
```
_Why:_ the caller is usually an agent assembling JSON — junk must fail loud, not render a broken page.

### Escaping is the default (JSX) · [lint: noDangerouslySetInnerHtml]
Interpolated `{value}` is auto-escaped by JSX. Raw HTML only through the `raw()` helper — never `dangerouslySetInnerHTML` directly. The one sanctioned exception is `Shell`, which injects its own **constant** `<script>`/`<style>` infra (never skill data) with an explicit `biome-ignore`.
```tsx
// ✓ <code>{snippet}</code>              // escaped
// ✓ {raw(trustedFragment)}             // explicit, reviewed
// ✗ <div dangerouslySetInnerHTML={{ __html: userStr }} />
```
_Why:_ injection/breakage is the #1 risk in a data→HTML tool; JSX makes safe the default.

### Components: arrow-const, PascalCase file, `XProps` interface · [lint: noDefaultExport]
One component per file; file name = component (`BeforeAfter.tsx`). Arrow-const **named** export. Props a named, exported, `readonly` interface. Local helpers are `function` declarations placed **below** the component (hoisted), so the component reads first.
```tsx
export interface PickBlockProps { readonly id: string; readonly chosen: string; /* … */ }
export const PickBlock = ({ id, chosen }: PickBlockProps) => (/* … */);
```
_Why:_ predictable file→component mapping; the component is the headline of its file.

### Naming · [taste]
components `PascalCase` · props `XProps` · fns/vars `camelCase` · constants `SCREAMING_SNAKE` · template ids & CLI flags `kebab-case`.

### Types · [taste]
`interface` for props/object shapes, `type` for unions; explicit return types on `render()` + exported non-component fns; JSX return inferred; no `any`, no prop-forcing casts (the JSON→props `as Props` at the CLI/registry boundary is the one sanctioned assertion).

### Errors by layer · [taste]
Pure render **throws** an actionable `Error`; the **server** uses exit codes (`0` decision · `2` bad-args/IO · `3` timeout, never-hang); the **CLI** throws and is caught once at the top → friendly message + non-zero exit.

### Tests: vitest, snapshot-first, co-located · [taste]
`BeforeAfter.test.tsx` beside source; `render(<T … />)` → assert on the HTML string (doctype, content, `data-id`s); plus units for escaping + that boundary asserts throw. Effectful `server`/`cli` get integration coverage as they grow.

### Gallery: every component is captured · [test: gallery-sync]
Each `src/components/*.tsx` (bar infra `Shell`/`SubmitBar`) carries a `GALLERY` entry in `src/gallery/registry.tsx` — `blurb` · `usage` · `props` · a live `sample()`. `src/gallery/registry.test.ts` fails on drift; `skill-ui capture` prints a paste-ready stub for anything missing. Fixed enum→style maps are `Record<Union, string>` (e.g. Callout `tone`, `StatusChip` status) — no arbitrary values.
_Why:_ the library-ui gallery is only trustworthy if it can't silently miss a component.

## Canonical example

```tsx
// src/templates/BeforeAfter/BeforeAfter.tsx — every pick together
import { DiffBlock } from "../../components/DiffBlock";
import { SectionCard } from "../../components/SectionCard";

export interface BeforeAfterProps {
  readonly title: string;
  readonly diffs: ReadonlyArray<{ readonly file: string; readonly before: string; readonly after: string }>;
}

export const BeforeAfter = ({ title, diffs }: BeforeAfterProps) => {
  if (diffs.length === 0) throw new Error("BeforeAfter: diffs[] is required and non-empty");
  return (
    <SectionCard title={title} chip="before → after">
      <div class="space-y-3">
        {diffs.map((d) => (
          <DiffBlock key={d.file} file={d.file} before={d.before} after={d.after} />
        ))}
      </div>
    </SectionCard>
  );
};
```

## Recipes

### How to add a template
1. `src/templates/<Name>/` → `<Name>.tsx` (arrow-const component, exported `readonly <Name>Props`, assert required props), `<Name>.test.tsx` (render + assert + throws), `README.md` (what it renders + an example `data.json`). Or run `skill-ui new <name>`.
2. Compose from `components/`; add a new shared component only on a real second consumer.
3. Register it in `src/templates/index.tsx` (`TEMPLATES` + a `SAMPLES` entry) and export from `src/index.ts`.
4. `npm run verify` (biome + tsc + vitest) green.

### How to add a component
1. `src/components/<Name>.tsx` — arrow-const, exported `readonly <Name>Props`, pure (data → JSX). One component per file; local helpers are `function` declarations below.
2. Register it in `src/gallery/registry.tsx` (`blurb` · `usage` · `props` · a live `sample`), or run `skill-ui capture` for a stub — the `gallery-sync` test enforces it.
3. Export from `src/index.ts`, then `npm run verify` green.

### How to add a CLI command
1. Add the subcommand in `src/cli/` (commander), routed into the SAME functions the menu uses.
2. Give it a real `--help`; a bare TTY still opens the menu; non-TTY defers to flags and never prompts.

## Exemplars

Write new code like these:
- `src/templates/BeforeAfter/BeforeAfter.tsx` — the composed template style.
- `src/components/PickBlock.tsx` — a shared interactive component with a `data-id`.
- `src/components/Timeline.tsx` — a plan-native primitive composing the shared `StatusChip`.
- `src/templates/Library/Library.tsx` — reads the `GALLERY` registry, groups, renders live previews.
- `src/server/serve.ts` — an effect edge: exit codes, never-hang, helpers below.

## Never

The AI-slop fingerprint for skill-ui:
- giveaway micro-helpers — `isRecord`, `isDefined`, `ensureArray`, `noop` · one-use wrappers · defensive guards the props type already proves · `[taste]`
- nested ternaries in JSX — flatten to early return / lookup / subcomponent · `[lint: noNestedTernary]`
- generic names — `handleData`, `processItem`, `result`, `temp`, `data2` · `[taste]`
- raw `dangerouslySetInnerHTML` outside `Shell`/`raw()` · `[lint: noDangerouslySetInnerHtml]`
- `document`/DOM APIs inside render — render is a pure string · `[taste]` (arch)
- default exports · `any` / prop-forcing casts · `[lint: noDefaultExport]`
- restyling the shell / inline styles — content in, structure fixed · `[taste]`
