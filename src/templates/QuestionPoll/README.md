# QuestionPoll

Interactive preference poll / grill surface — multiple-choice questions with auto-advance, a floating nav rail, progress bar, optional Mermaid diagrams, and the full Approve / Adjust post-back loop. Used by grill-style skills to collect style or architecture picks in the browser.

## Data

```json
{
  "title": "Code style picks",
  "layout": "stack",
  "questions": [
    {
      "id": "rule.component-form",
      "text": "How should components be declared?",
      "group": "Components",
      "options": [
        {
          "id": "arrow",
          "label": "Arrow const",
          "description": "export const X = () => …",
          "code": "export const Callout = () => <div/>;",
          "recommended": true
        },
        {
          "id": "function",
          "label": "Function declaration",
          "description": "export function X() { … }"
        }
      ]
    }
  ]
}
```

- `title` — page heading (required).
- `questions[]` — non-empty; each has `id`, `text`, `options[]` (`id`, `label`, optional `description` / `code` / `recommended`).
- `layout` — optional: `stack` (default) · `grid-2` · `grid-3` · `grid-4` · `grid-5`.
- Optional per question: `group` (section header), `diagram` (Mermaid source).

## Render

```tsx
import { render, QuestionPoll } from "planpage";
const html = render(<QuestionPoll title="Picks" questions={questions} />);
```

Or from the CLI:

```bash
planpage render question-poll --data questions.json --open
planpage render question-poll --sample --serve --decision decision.json
```

`--serve` collects answers as JSON (`answers`, `skipped`, `notes`, `approved`) and never hangs a non-TTY caller.
