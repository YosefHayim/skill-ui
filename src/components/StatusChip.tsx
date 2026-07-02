/** The status of a plan step. Drives the colour of a StatusChip / Steps / Timeline node. */
export type StepStatus = "todo" | "doing" | "done" | "blocked";

export interface StatusChipProps {
  readonly status: StepStatus;
  /** Override the visible text; defaults to the status itself. */
  readonly label?: string;
}

const STATUS_STYLE: Record<StepStatus, string> = {
  todo: "bg-slate-500/15 text-slate-500 dark:text-slate-300",
  doing: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  blocked: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
};

/** A tiny status pill (todo · doing · done · blocked). The shared primitive under Steps/Timeline. */
export const StatusChip = ({ status, label }: StatusChipProps) => (
  <span class={`chip ${STATUS_STYLE[status]}`}>{label ?? status}</span>
);
