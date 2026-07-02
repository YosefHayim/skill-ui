import { describe, expect, it } from "vitest";
import { GALLERY } from "../../gallery/registry";
import { render } from "../../render/render";
import { Library } from "./Library";

describe("Library", () => {
  it("renders a self-contained gallery that names every registered component", () => {
    const html = render(<Library />);
    expect(html.startsWith("<!doctype html>")).toBe(true);
    for (const name of Object.keys(GALLERY)) {
      expect(html).toContain(name);
    }
  });

  it("renders each component's live sample (Callout tone reaches the output)", () => {
    const html = render(<Library />);
    expect(html).toContain("Blast radius");
  });
});
