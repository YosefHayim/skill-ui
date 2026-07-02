import type { VNode } from "preact";
import { BeforeAfter, type BeforeAfterProps } from "./BeforeAfter/BeforeAfter";
import { CodeStylePlan, type CodeStylePlanProps } from "./CodeStylePlan/CodeStylePlan";

/**
 * Registry mapping a kebab-case template name → a factory that builds its VNode from raw data.
 * The `as Props` spreads are the sanctioned JSON→props boundary assertion; each template then
 * asserts its own required fields at runtime.
 */
export const TEMPLATES = {
  "before-after": (data: unknown): VNode => <BeforeAfter {...(data as BeforeAfterProps)} />,
  "code-style-plan": (data: unknown): VNode => <CodeStylePlan {...(data as CodeStylePlanProps)} />,
} satisfies Record<string, (data: unknown) => VNode>;

export type TemplateName = keyof typeof TEMPLATES;

/** Built-in sample data per template — powers the menu preview and `render --sample`. */
export const SAMPLES: Record<TemplateName, unknown> = {
  "before-after": {
    title: "Deslop pass",
    diffs: [
      { file: "src/render/render.tsx", before: "let out = ''", after: "const out = render(node)" },
    ],
  },
  "code-style-plan": {
    title: "skill-ui — code style",
    picks: [
      {
        id: "rule.component-form",
        rule: "Component form",
        chosen: "const C = () => <div/>",
        rejected: "function C(){ return <div/> }",
        why: "arrow-const, named export",
        tag: "[taste]",
      },
    ],
    canonical: {
      label: "src/templates/BeforeAfter/BeforeAfter.tsx",
      code: "export const BeforeAfter = ({ title, diffs }: BeforeAfterProps) => …",
    },
    cliFlow: "flowchart LR\n  A[skill-ui] -->|TTY| M[menu]\n  A -->|flags| F[render / serve / new]",
  },
};
