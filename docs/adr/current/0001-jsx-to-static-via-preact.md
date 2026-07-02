# 0001 — JSX → static HTML via Preact

**Status:** accepted (2026-07-02)

## Context

skill-ui renders planning artifacts to a self-contained HTML file the reader opens. The look is identical whether templates are authored as vanilla string functions, JSX-to-static, or a full client React app — the fork is authoring DX and runtime weight. Consumers are skills an agent runs; the reader wants zero-install.

## Decision

Author templates as **Preact components** and render them to a **static HTML string** with `preact-render-to-string` (`renderToStaticMarkup`), wrapped by our `render()`. No client-side hydration by default — interactivity is an opt-in island (see [0002](0002-static-floor-optin-postback.md)). Preact over React for tiny footprint and first-class SSR.

## Consequences

- Component/JSX ergonomics for authoring; a growable gallery; typed props.
- The reader gets a plain, fast, self-contained file with zero client JS by default.
- JSX **auto-escapes** interpolated data — escaping is the default, not a discipline (raw HTML only via `raw()`).
- Consumers author against our components with the Preact JSX pragma (`jsxImportSource: "preact"`); a consuming skill's assembling script is `.tsx`.
