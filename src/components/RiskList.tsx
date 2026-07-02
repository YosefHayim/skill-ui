export type Severity = "low" | "med" | "high";

export interface Risk {
  readonly risk: string;
  readonly severity: Severity;
  readonly mitigation?: string;
}

export interface RiskListProps {
  readonly items: ReadonlyArray<Risk>;
}

const SEVERITY: Record<Severity, string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  med: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  high: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
};

/** Severity-tagged risks/tradeoffs, each with an optional mitigation. */
export const RiskList = ({ items }: RiskListProps) => (
  <ul class="space-y-2">
    {items.map((r) => (
      <li
        key={r.risk}
        class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
      >
        <span class={`chip ${SEVERITY[r.severity]}`}>{r.severity}</span>
        <div class="min-w-0 flex-1 text-sm">
          <span class="text-slate-800 dark:text-slate-100">{r.risk}</span>
          {r.mitigation ? (
            <p class="mt-1 text-slate-500 text-xs dark:text-slate-400">↳ {r.mitigation}</p>
          ) : null}
        </div>
      </li>
    ))}
  </ul>
);
