export interface Stat {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
}

export interface PlanSummaryProps {
  readonly stats: ReadonlyArray<Stat>;
}

/**
 * A blast-radius header — the at-a-glance metrics of a plan (files · modules · risk · confidence).
 * Cards flex-wrap to the available width, so they never spill past a narrow container.
 */
export const PlanSummary = ({ stats }: PlanSummaryProps) => (
  <div class="flex flex-wrap gap-3">
    {stats.map((s) => (
      <div
        key={s.label}
        class="min-w-[7rem] flex-1 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
      >
        <div class="font-bold text-2xl text-slate-900 dark:text-white">{s.value}</div>
        <div class="mt-1 font-medium text-slate-500 text-xs dark:text-slate-400">{s.label}</div>
        {s.hint ? <div class="mt-0.5 text-[11px] text-slate-400">{s.hint}</div> : null}
      </div>
    ))}
  </div>
);
