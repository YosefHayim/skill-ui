# CodeStylePlan

The pick-the-code gallery + canonical example + CLI flow, as an interactive review gate. Pair it with `--serve` to collect an approve/adjust/flip decision.

## Data

```json
{
  "title": "skill-ui — code style",
  "picks": [
    {
      "id": "rule.component-form",
      "rule": "Component form",
      "chosen": "const C = () => <div/>",
      "rejected": "function C(){}",
      "why": "arrow-const, named export",
      "tag": "[taste]"
    }
  ],
  "canonical": { "label": "src/…/BeforeAfter.tsx", "code": "export const BeforeAfter = …" },
  "cliFlow": "flowchart LR\n  A[skill-ui] -->|TTY| M[menu]\n  A -->|flags| F[render]"
}
```

- `picks[]` — required, non-empty. Each carries a stable `id` (returned in `flips`/`revisit`).
- `canonical`, `cliFlow` — optional.

## Render

```tsx
const html = render(<CodeStylePlan title="…" picks={picks} />, { interactive: true });
```

Interactive gate + decision: `skill-ui render code-style-plan --data plan.json --serve --decision out.json`.
