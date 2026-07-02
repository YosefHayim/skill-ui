# PlanBrief

The flagship template — a whole **agent plan on one readable page**: a blast-radius summary, margin notes, the ordered steps, the approaches weighed, the risks, one annotated key change, and foldaway detail. Every section renders only when its data is present, so a partial plan is fine.

## Data

```json
{
  "title": "Add dark-mode toggle",
  "summary": [
    { "label": "Files", "value": "6" },
    { "label": "Risk", "value": "low" },
    { "label": "Confidence", "value": "85%" }
  ],
  "notes": [{ "tone": "decision", "title": "Approach", "body": "Class-based dark mode, prepainted to avoid FOUC." }],
  "steps": [
    { "label": "Add the toggle button", "status": "done" },
    { "label": "Prepaint the theme", "status": "doing", "detail": "read the OS preference before paint" },
    { "label": "Persist the choice", "status": "todo" }
  ],
  "options": [
    { "name": "Class strategy", "pros": ["no flash", "simple"], "cons": ["needs prepaint"], "verdict": "chosen" },
    { "name": "Media query only", "pros": ["zero JS"], "cons": ["no manual toggle"], "verdict": "rejected" }
  ],
  "risks": [{ "risk": "Flash of unstyled content", "severity": "low", "mitigation": "prepaint script in <head>" }],
  "code": {
    "label": "theme.ts",
    "code": "const dark = prefersDark()\ndocument.documentElement.classList.toggle('dark', dark)",
    "annotations": [{ "line": 1, "note": "read OS preference" }, { "line": 2, "note": "before first paint" }]
  },
  "details": [{ "summary": "Why class-based?", "detail": "Lets a manual toggle override the OS preference." }]
}
```

- `title` — required. Everything else is optional; a section appears only when its array is non-empty.

## Render

```tsx
import { render, PlanBrief } from "skill-ui";
const html = render(<PlanBrief {...plan} />);
```

From the CLI: `skill-ui render plan-brief --data plan.json --open` (try `--sample`).
