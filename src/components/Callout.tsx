import type { ComponentChildren } from "preact";

/** The kind of margin note — fixes the colour + icon. No arbitrary tones. */
export type CalloutTone =
  | "note"
  | "warn"
  | "success"
  | "danger"
  | "risk"
  | "decision"
  | "assumption";

export interface CalloutProps {
  readonly tone: CalloutTone;
  readonly title?: string;
  readonly children: ComponentChildren;
}

const TONE: Record<CalloutTone, { readonly icon: string; readonly cls: string }> = {
  note: { icon: "🛈", cls: "border-slate-400/40 bg-slate-500/10" },
  warn: { icon: "⚠", cls: "border-amber-500/40 bg-amber-500/10" },
  success: { icon: "✓", cls: "border-emerald-500/40 bg-emerald-500/10" },
  danger: { icon: "✕", cls: "border-rose-500/40 bg-rose-500/10" },
  risk: { icon: "▲", cls: "border-orange-500/40 bg-orange-500/10" },
  decision: { icon: "◆", cls: "border-indigo-500/40 bg-indigo-500/10" },
  assumption: { icon: "≈", cls: "border-sky-500/40 bg-sky-500/10" },
};

/** A tone-coloured admonition — the agent's margin note (note · risk · decision · assumption · …). */
export const Callout = ({ tone, title, children }: CalloutProps) => {
  const { icon, cls } = TONE[tone];
  return (
    <div class={`flex gap-3 rounded-xl border p-4 ${cls}`}>
      <span class="text-lg leading-none" aria-hidden="true">
        {icon}
      </span>
      <div class="space-y-1 text-sm">
        {title ? <div class="font-semibold text-slate-800 dark:text-slate-100">{title}</div> : null}
        <div class="text-slate-600 dark:text-slate-300">{children}</div>
      </div>
    </div>
  );
};
