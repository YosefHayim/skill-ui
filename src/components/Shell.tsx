import type { ComponentChildren } from "preact";
import { CLIENT_SCRIPT, THEME_TOGGLE } from "../render/clientScript";
import type { Theme } from "../render/theme";
import { SubmitBar } from "./SubmitBar";

export interface ShellProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly theme?: Theme;
  /** When true, includes the sticky submit-bar + the post-back client script. */
  readonly interactive?: boolean;
  readonly children: ComponentChildren;
}

const TAILWIND_CONFIG =
  "tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{mono:['ui-monospace','SFMono-Regular','Menlo','monospace']}}}}";

const THEME_PREPAINT =
  "(function(){try{var t=document.documentElement.getAttribute('data-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');}catch(e){}})();";

const MERMAID =
  "import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';mermaid.initialize({startOnLoad:true,theme:document.documentElement.classList.contains('dark')?'dark':'neutral',securityLevel:'loose'});";

const STYLE =
  ".code{white-space:pre;overflow-x:auto;tab-size:2}.chip{font-size:11px;padding:2px 9px;border-radius:999px;font-weight:600}.mermaid{display:flex;justify-content:center}.pick.flipped .chosen{opacity:.4;filter:grayscale(1)}.pick.flipped .rejected{opacity:1;filter:none;outline:2px solid #34d399}.pick.revisit{outline:2px dashed #fbbf24;outline-offset:4px;border-radius:12px}";

/**
 * The fixed page skeleton every rendered document nests inside: Tailwind + Mermaid from
 * CDN, light/dark theme, sticky header, and (interactive only) the submit-bar. Skills supply
 * content and never restyle this shell — a fixed shell is what makes every report look alike.
 */
export const Shell = ({
  title = "skill-ui",
  subtitle,
  theme = "auto",
  interactive = false,
  children,
}: ShellProps) => (
  <html lang="en" data-theme={theme}>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <script src="https://cdn.tailwindcss.com" />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra script, not skill data */}
      <script dangerouslySetInnerHTML={{ __html: TAILWIND_CONFIG }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra script, not skill data */}
      <script dangerouslySetInnerHTML={{ __html: THEME_PREPAINT }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra style, not skill data */}
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
    </head>
    <body class="bg-white font-sans text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-200">
      <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div class="mx-auto flex max-w-5xl items-center gap-3">
          <span class="grid h-6 w-6 place-items-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">
            UI
          </span>
          <div>
            <h1 class="text-sm font-semibold text-slate-900 dark:text-white">{title}</h1>
            {subtitle ? <p class="text-[11px] text-slate-400">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            data-action="theme"
            title="toggle light / dark"
            class="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ◐
          </button>
        </div>
      </header>
      <main class={`mx-auto max-w-5xl space-y-8 px-6 py-8 ${interactive ? "pb-40" : ""}`}>
        {children}
      </main>
      {interactive ? <SubmitBar /> : null}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra module, not skill data */}
      <script type="module" dangerouslySetInnerHTML={{ __html: MERMAID }} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra script, not skill data */}
      <script dangerouslySetInnerHTML={{ __html: THEME_TOGGLE }} />
      {interactive ? (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shell infra script, not skill data
        <script dangerouslySetInnerHTML={{ __html: CLIENT_SCRIPT }} />
      ) : null}
    </body>
  </html>
);
