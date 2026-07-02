import type { VNode } from "preact";

/**
 * The ONE sanctioned way to inject trusted, pre-built HTML into a template.
 * biome bans `dangerouslySetInnerHTML` everywhere else — route raw HTML through here.
 *
 * Use only for HTML you fully control. NEVER pass skill-supplied strings: JSX already
 * escapes those on interpolation, which is the whole point of the render layer.
 *
 * @param html - trusted HTML fragment to inline verbatim
 * @returns a display-transparent span wrapping the raw HTML
 */
export const raw = (html: string): VNode => (
  // biome-ignore lint/security/noDangerouslySetInnerHtml: this is the sole sanctioned raw() hatch
  <span style="display:contents" dangerouslySetInnerHTML={{ __html: html }} />
);
