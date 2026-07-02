import type { VNode } from "preact";
import { renderToStaticMarkup } from "preact-render-to-string";
import { Shell, type ShellProps } from "../components/Shell";

/** Options forwarded to the document Shell (everything but its children). */
export type RenderOptions = Omit<ShellProps, "children">;

/**
 * Render a template or component tree into a complete, self-contained HTML document string.
 * This is the single boundary between pure JSX and a shippable artifact — no I/O happens here.
 *
 * @param content - the template/component tree to render inside the Shell
 * @param options - Shell options (title, subtitle, theme, interactive)
 * @returns a full `<!doctype html>` document as a string
 */
export const render = (content: VNode, options: RenderOptions = {}): string => {
  const doc = <Shell {...options}>{content}</Shell>;
  return `<!doctype html>\n${renderToStaticMarkup(doc)}`;
};
