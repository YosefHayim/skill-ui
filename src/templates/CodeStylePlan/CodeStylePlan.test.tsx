import { describe, expect, it } from "vitest";
import { render } from "../../render/render";
import { CodeStylePlan } from "./CodeStylePlan";

const PICKS = [
  {
    id: "rule.component-form",
    rule: "Component form",
    chosen: "const C = () => <div/>",
    rejected: "function C(){}",
    why: "arrow-const",
    tag: "[taste]",
  },
];

describe("CodeStylePlan", () => {
  it("renders picks with stable data-ids and the submit bar when interactive", () => {
    const html = render(<CodeStylePlan title="Style" picks={PICKS} />, { interactive: true });
    expect(html).toContain('data-id="rule.component-form"');
    expect(html).toContain('id="sui-bar"');
    expect(html).toContain('data-action="approve"');
  });

  it("omits the submit bar when not interactive", () => {
    const html = render(<CodeStylePlan title="Style" picks={PICKS} />);
    expect(html).not.toContain('id="sui-bar"');
  });

  it("throws an actionable error on empty picks", () => {
    expect(() => render(<CodeStylePlan title="x" picks={[]} />)).toThrow(/picks\[\] is required/);
  });
});
