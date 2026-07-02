import { describe, expect, it } from "vitest";
import { render } from "../../render/render";
import { PlanBrief } from "./PlanBrief";

describe("PlanBrief", () => {
  it("renders the sections whose data is present", () => {
    const html = render(
      <PlanBrief
        title="Add dark-mode toggle"
        summary={[{ label: "Files", value: "6" }]}
        steps={[{ label: "Add the toggle", status: "doing" }]}
        risks={[{ risk: "FOUC on load", severity: "low" }]}
      />,
    );
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("Add dark-mode toggle");
    expect(html).toContain("Add the toggle");
    expect(html).toContain("FOUC on load");
  });

  it("throws an actionable error when title is missing", () => {
    expect(() => render(<PlanBrief title="" />)).toThrow(/title is required/);
  });
});
