# Library

The living, auto-captured component gallery — every registered component with a **live preview**, its **usage** snippet, and a **props** table, grouped by category, plus an index of the templates.

Unlike other templates it takes no JSON data: it reads the `GALLERY` registry (`src/gallery/registry.tsx`) directly, so a component shows up the moment it is registered. The `gallery-sync` test (`src/gallery/registry.test.ts`) fails if any component in `src/components/` is missing from the registry, so the gallery is always complete.

## Render

```tsx
import { render } from "skill-ui";
import { Library } from "skill-ui";
const html = render(<Library />);
```

From the CLI:

```bash
skill-ui library --open          # render the gallery and open it
skill-ui capture                 # report any component missing from the registry
```

## Adding a component to the gallery

1. Write `src/components/<Name>.tsx`.
2. Add an entry to `GALLERY` in `src/gallery/registry.tsx` (`blurb` · `usage` · `props` · `sample`), or run `skill-ui capture` to print a stub.
3. `npm run verify` — the `gallery-sync` test must be green.
