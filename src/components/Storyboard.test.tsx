import { describe, expect, it } from "vitest";
import { render } from "../render/render";
import { Storyboard } from "./Storyboard";

const FRAMES = [
  { src: "frame-01.png", caption: "Cold open", index: 1 },
  { src: "frame-02.png", caption: "Reveal", index: 2 },
  { src: "frame-03.png", caption: "Climax" },
];

describe("Storyboard", () => {
  it("renders a responsive grid with data-id, columns, frames, and captions", () => {
    const html = render(
      <Storyboard dataId="storyboard.trailer-keyframes" columns={3} frames={FRAMES} />,
    );
    expect(html).toContain("data-storyboard");
    expect(html).toContain('data-id="storyboard.trailer-keyframes"');
    expect(html).toContain('data-columns="3"');
    expect(html).toContain("lg:grid-cols-3");
    expect(html).toContain("data-frame");
    expect(html).toContain('src="frame-01.png"');
    expect(html).toContain("Cold open");
    expect(html).toContain("01");
    // third frame has no index — defaults to 1-based position
    expect(html).toContain("03");
  });

  it("defaults columns to 3", () => {
    const html = render(<Storyboard dataId="sb.demo" frames={[{ src: "a.png" }]} />);
    expect(html).toContain('data-columns="3"');
    expect(html).toContain("lg:grid-cols-3");
  });

  it("escapes frame captions", () => {
    const html = render(
      <Storyboard
        dataId="sb.xss"
        frames={[{ src: "x.png", caption: "<script>alert(1)</script>" }]}
      />,
    );
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script>");
  });

  it("throws when frames is empty", () => {
    expect(() => render(<Storyboard dataId="sb.empty" frames={[]} />)).toThrow(
      "frames[] is required",
    );
  });

  it("throws when dataId is missing", () => {
    expect(() => render(<Storyboard dataId="" frames={[{ src: "a.png" }]} />)).toThrow(
      "dataId is required",
    );
  });

  it("throws when columns is out of range", () => {
    expect(() =>
      render(<Storyboard dataId="sb.cols" columns={7} frames={[{ src: "a.png" }]} />),
    ).toThrow("columns must be an integer from 1 to 6");
  });

  it("throws when columns is not an integer", () => {
    expect(() =>
      render(
        <Storyboard
          dataId="sb.frac"
          columns={3.5 as unknown as number}
          frames={[{ src: "a.png" }]}
        />,
      ),
    ).toThrow("columns must be an integer from 1 to 6");
  });

  it("uses caption as alt by default, or explicit alt / Frame N", () => {
    const html = render(
      <Storyboard
        dataId="sb.alt"
        frames={[
          { src: "a.png", caption: "Cold open" },
          { src: "b.png", alt: "Custom alt" },
          { src: "c.png", alt: "" },
          { src: "d.png" },
        ]}
      />,
    );
    expect(html).toContain('alt="Cold open"');
    expect(html).toContain('alt="Custom alt"');
    // Preact omits `=""` for empty string attrs — decorative frames render as bare `alt`
    expect(html).toMatch(/src="c\.png" alt(?:=""|[\s>])/);
    expect(html).toContain('alt="Frame 4"');
  });
});
