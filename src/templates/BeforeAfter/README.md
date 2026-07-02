# BeforeAfter

A titled section of green/red before→after diffs — the workhorse report for deslop passes, refactors, and migrations.

## Data

```json
{
  "title": "Deslop pass",
  "diffs": [
    { "file": "src/x.ts", "before": "let x = 1", "after": "const x = 1" }
  ]
}
```

- `title` — section heading (required).
- `diffs[]` — one entry per file/snippet (required, non-empty): `file`, `before`, `after`.

## Render

```tsx
import { render, BeforeAfter } from "skill-ui";
const html = render(<BeforeAfter title="Deslop pass" diffs={diffs} />);
```

Or from the CLI: `skill-ui render before-after --data diffs.json --open` (try `--sample`).
