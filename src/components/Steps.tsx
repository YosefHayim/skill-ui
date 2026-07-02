import { StatusChip, type StepStatus } from "./StatusChip";

export interface Step {
  readonly label: string;
  readonly status: StepStatus;
  readonly detail?: string;
}

export interface StepsProps {
  readonly items: ReadonlyArray<Step>;
}

/** A numbered checklist — the plan's ordered work, each step carrying a status. */
export const Steps = ({ items }: StepsProps) => (
  <ol class="space-y-2">
    {items.map((s, i) => (
      <li
        key={s.label}
        class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
      >
        <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 font-semibold text-slate-500 text-xs dark:bg-slate-800 dark:text-slate-300">
          {i + 1}
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-slate-800 text-sm dark:text-slate-100">{s.label}</span>
            <StatusChip status={s.status} />
          </div>
          {s.detail ? (
            <p class="mt-1 text-slate-500 text-xs dark:text-slate-400">{s.detail}</p>
          ) : null}
        </div>
      </li>
    ))}
  </ol>
);
