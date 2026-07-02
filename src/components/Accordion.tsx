import type { ComponentChildren } from "preact";

export interface AccordionItem {
  readonly summary: string;
  readonly detail: ComponentChildren;
  /** Open on first paint. */
  readonly open?: boolean;
}

export interface AccordionProps {
  readonly items: ReadonlyArray<AccordionItem>;
}

/** Progressive disclosure via native <details> — skim the summaries, expand on demand. No JS. */
export const Accordion = ({ items }: AccordionProps) => (
  <div class="space-y-2">
    {items.map((it) => (
      <details
        key={it.summary}
        open={it.open}
        class="group rounded-xl border border-slate-200 dark:border-slate-800"
      >
        <summary class="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium text-slate-800 text-sm marker:content-none dark:text-slate-100">
          <span class="inline-block text-slate-400 transition-transform group-open:rotate-90">
            ▸
          </span>
          {it.summary}
        </summary>
        <div class="border-slate-100 border-t px-4 py-3 text-slate-600 text-sm dark:border-slate-800 dark:text-slate-300">
          {it.detail}
        </div>
      </details>
    ))}
  </div>
);
