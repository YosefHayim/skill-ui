export interface TreePanelProps {
  /** Omit to render a single "after" tree (no before column). */
  readonly before?: string;
  readonly after: string;
}

/** Side-by-side ASCII directory trees. Feed each pane output from ascii-architecture-flow-mapper. */
export const TreePanel = ({ before, after }: TreePanelProps) => (
  <div class="grid gap-3 md:grid-cols-2">
    {before !== undefined ? (
      <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div class="mb-2 text-xs text-slate-400">before</div>
        <pre class="code text-xs text-slate-500 dark:text-slate-400">
          <code>{before}</code>
        </pre>
      </div>
    ) : null}
    <div class="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div class="mb-2 text-xs text-slate-400">after</div>
      <pre class="code text-xs text-emerald-600 dark:text-emerald-300">
        <code>{after}</code>
      </pre>
    </div>
  </div>
);
