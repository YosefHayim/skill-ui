import { describe, expect, it } from "vitest";
import { render } from "../../render/render";
import { BeforeAfter } from "./BeforeAfter";

const DIFFS = [{ file: "src/x.ts", before: "let x = 1", after: "const x = 1" }];

describe("BeforeAfter", () => {
  it("renders a self-contained document containing the data", () => {
    const html = render(<BeforeAfter title="Deslop pass" diffs={DIFFS} />);
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("Deslop pass");
    expect(html).toContain("const x = 1");
  });

  it("escapes interpolated data instead of injecting it", () => {
    const html = render(
      <BeforeAfter
        title="x"
        diffs={[{ file: "a", before: "<img src=x onerror=alert(1)>", after: "ok" }]}
      />,
    );
    expect(html).not.toContain("<img src=x onerror=alert(1)>");
    expect(html).toContain("&lt;img");
  });

  it("throws an actionable error on empty diffs", () => {
    expect(() => render(<BeforeAfter title="x" diffs={[]} />)).toThrow(/diffs\[\] is required/);
  });
});
