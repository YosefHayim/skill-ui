/** Where an option landed after weighing. Colours the card. */
export type Verdict = "chosen" | "rejected" | "maybe";

export interface CompareOption {
  readonly name: string;
  readonly pros: ReadonlyArray<string>;
  readonly cons: ReadonlyArray<string>;
  readonly verdict?: Verdict;
}

export interface OptionCompareProps {
  readonly options: ReadonlyArray<CompareOption>;
}

const VERDICT: Record<Verdict, string> = {
  chosen: "border-emerald-600/50 ring-1 ring-emerald-500/30",
  rejected: "border-rose-700/30 opacity-60",
  maybe: "border-amber-500/40",
};

/** N-way approach comparison — pros/cons side by side with a verdict. The PickBlock's big sibling. */
export const OptionCompare = ({ options }: OptionCompareProps) => (
  <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    {options.map((o) => (
      <div
        key={o.name}
        class={`rounded-xl border p-4 ${o.verdict ? VERDICT[o.verdict] : "border-slate-200 dark:border-slate-800"}`}
      >
        <div class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-slate-900 text-sm dark:text-white">{o.name}</span>
          {o.verdict ? (
            <span class="chip bg-slate-500/15 text-slate-500 dark:text-slate-300">{o.verdict}</span>
          ) : null}
        </div>
        <ul class="space-y-1 text-xs">
          {o.pros.map((p) => (
            <li key={p} class="text-emerald-600 dark:text-emerald-300">
              + {p}
            </li>
          ))}
          {o.cons.map((c) => (
            <li key={c} class="text-rose-500 dark:text-rose-300">
              − {c}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);
