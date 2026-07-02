import { DiffBlock } from "../../components/DiffBlock";
import { SectionCard } from "../../components/SectionCard";

export interface BeforeAfterProps {
  readonly title: string;
  readonly diffs: ReadonlyArray<{
    readonly file: string;
    readonly before: string;
    readonly after: string;
  }>;
}

/** A titled section of green/red before→after diffs — the workhorse report (deslop, refactors). */
export const BeforeAfter = ({ title, diffs }: BeforeAfterProps) => {
  if (diffs.length === 0) throw new Error("BeforeAfter: diffs[] is required and non-empty");
  return (
    <SectionCard title={title} chip="before → after">
      <div class="space-y-3">
        {diffs.map((d) => (
          <DiffBlock key={d.file} file={d.file} before={d.before} after={d.after} />
        ))}
      </div>
    </SectionCard>
  );
};
