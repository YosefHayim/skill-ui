export interface FlowProps {
  /** Raw Mermaid source (e.g. a `flowchart LR …`). Rendered as text — Mermaid reads it client-side. */
  readonly source: string;
}

/** A Mermaid diagram wrapper, for CLI routing / module graphs / decision trees. */
export const Flow = ({ source }: FlowProps) => (
  <div class="rounded-xl border border-slate-200 p-6 dark:border-slate-800">
    <pre class="mermaid">{source}</pre>
  </div>
);
