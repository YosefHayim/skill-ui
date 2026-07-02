export interface CodeBlockProps {
  /** Optional header, e.g. "Canonical example — src/orders/create-order.ts". */
  readonly label?: string;
  readonly code: string;
}

/** A plain highlighted snippet, or the composed canonical-example block. */
export const CodeBlock = ({ label, code }: CodeBlockProps) => (
  <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
    {label ? (
      <div class="border-b border-slate-100 px-3 py-2 font-mono text-xs text-slate-500 dark:border-slate-800">
        {label}
      </div>
    ) : null}
    <pre class="code bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
      <code>{code}</code>
    </pre>
  </div>
);
