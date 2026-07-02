import { CodeBlock } from "../../components/CodeBlock";
import { SectionCard } from "../../components/SectionCard";
import { GALLERY, type GalleryName, type PropDoc, TEMPLATE_INDEX } from "../../gallery/registry";

export interface LibraryProps {
  readonly title?: string;
}

/**
 * The living, auto-captured gallery: every registered component with its live preview, usage
 * snippet, and props. Reads the GALLERY registry directly (not JSON), so a new component appears
 * the moment it is registered. Rendered by `skill-ui library`.
 */
export const Library = ({ title = "skill-ui — component gallery" }: LibraryProps) => {
  const names = Object.keys(GALLERY) as ReadonlyArray<GalleryName>;
  return (
    <div class="space-y-8">
      <SectionCard title={title} chip={`${names.length} components`}>
        <p class="text-slate-500 text-sm dark:text-slate-400">
          Every component in the kit, captured automatically — live preview, usage, and props.
        </p>
      </SectionCard>
      {groupByCategory(names).map(([category, entries]) => (
        <SectionCard key={category} title={category} chip={`${entries.length}`}>
          <div class="space-y-6">
            {entries.map((name) => (
              <EntryCard key={name} name={name} />
            ))}
          </div>
        </SectionCard>
      ))}
      <SectionCard title="Templates" chip={`${TEMPLATE_INDEX.length}`}>
        <ul class="space-y-2">
          {TEMPLATE_INDEX.map((template) => (
            <li
              key={template.name}
              class="flex flex-wrap items-baseline gap-x-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            >
              <code class="text-indigo-500 text-sm">{template.name}</code>
              <span class="text-slate-500 text-sm dark:text-slate-400">{template.blurb}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
};

function groupByCategory(
  names: ReadonlyArray<GalleryName>,
): ReadonlyArray<[string, ReadonlyArray<GalleryName>]> {
  const buckets = new Map<string, GalleryName[]>();
  for (const name of names) {
    const list = buckets.get(GALLERY[name].category) ?? [];
    list.push(name);
    buckets.set(GALLERY[name].category, list);
  }
  return [...buckets];
}

function EntryCard({ name }: { readonly name: GalleryName }) {
  const entry = GALLERY[name];
  return (
    <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div class="mb-3 flex flex-wrap items-baseline gap-2">
        <h3 class="font-semibold text-slate-900 dark:text-white">{name}</h3>
        <span class="text-slate-500 text-xs dark:text-slate-400">{entry.blurb}</span>
      </div>
      <div class="mb-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        {entry.sample()}
      </div>
      <CodeBlock code={entry.usage} />
      <PropsTable props={entry.props} />
    </div>
  );
}

function PropsTable({ props }: { readonly props: ReadonlyArray<PropDoc> }) {
  if (props.length === 0) return null;
  return (
    <table class="mt-3 w-full text-left text-xs">
      <tbody>
        {props.map((prop) => (
          <tr key={prop.name} class="border-slate-100 border-t dark:border-slate-800">
            <td class="py-1 pr-3 font-mono text-slate-700 dark:text-slate-200">{prop.name}</td>
            <td class="py-1 pr-3 font-mono text-slate-400">{prop.type}</td>
            <td class="py-1 text-slate-400">{prop.required ? "required" : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
