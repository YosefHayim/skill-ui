# 0013 — Unscoped npm name: `planpage` (rebrand from `skill-ui`)

**Status:** accepted (2026-07-02) — supersedes [0012](0012-scoped-npm-name.md)

## Context

[0012](0012-scoped-npm-name.md) worked around npm's similarity guard — which `403`s the bare `skill-ui` as too close to the existing `skillui` — by publishing scoped as `@yosefsabag/skill-ui`. In practice the scope read as personal and half-measured for an open-source kit: the install string carried a username and still didn't match the brand. And keeping `skill-ui` at all was optional — nothing had been published yet, so a clean rename cost zero migration.

## Decision

Rebrand to a distinct, unscoped name: **`planpage`** (plan → page — it renders an agent's plan as a page).

- `package.json` `name` is `planpage`; unscoped packages are public by default, so `publishConfig` is dropped.
- **One name everywhere** — the `bin`, the import, the git repo, and the local working folder are all `planpage`. `npx planpage` runs with no install.
- `planpage` is distinct enough to clear the similarity guard, unlike the whole `skill-ui` / `skill-uii` / `skillui` family, which all normalise to `skillui`.
- The `init`-generated skill and the dufflebag consumer reference the bare `planpage` specifier.

## Consequences

- The `skill-ui` identity is fully retired — repo, folder, bin, docs. Renaming the GitHub repo is the one outward-facing follow-up; GitHub redirects the old URL, so existing clones/links keep working.
- Downstream: dufflebag's consumer skill and the two grill skills move off the vendored `serve-plan.mjs` / `@yosefsabag/skill-ui` onto `npx planpage serve`.
- Supersedes 0012 entirely. The similarity-guard finding in 0012 still holds — it is exactly why a distinct word (not `skill-ui`) was required.
