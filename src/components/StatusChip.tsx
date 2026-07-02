/** The status of a plan step. Drives the colour + icon of a StatusChip / Steps / Timeline node. */
export type StepStatus = "todo" | "doing" | "done" | "blocked";

export interface StatusChipProps {
  readonly status: StepStatus;
  /** Override the visible text; defaults to the status label (Todo · Doing · Done · Blocked). */
  readonly label?: string;
}

const STATUS: Record<
  StepStatus,
  { readonly icon: string; readonly cls: string; readonly label: string; readonly spin?: boolean }
> = {
  todo: { icon: "○", cls: "bg-slate-500/15 text-slate-500 dark:text-slate-300", label: "Todo" },
  doing: {
    icon: "◐",
    cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    label: "Doing",
    spin: true,
  },
  done: {
    icon: "✓",
    cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    label: "Done",
  },
  blocked: { icon: "✕", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300", label: "Blocked" },
};

/** A tiny status pill with a leading icon (Todo · Doing · Done · Blocked). The shared primitive under Steps/Timeline. */
export const StatusChip = ({ status, label }: StatusChipProps) => {
  const s = STATUS[status];
  return (
    <span class={`chip inline-flex items-center gap-1 ${s.cls}`}>
      <span class={s.spin ? "spin" : undefined} aria-hidden="true">
        {s.icon}
      </span>
      {label ?? s.label}
    </span>
  );
};
