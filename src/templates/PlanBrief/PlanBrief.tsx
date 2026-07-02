import { Accordion } from "../../components/Accordion";
import { AnnotatedCode, type Annotation } from "../../components/AnnotatedCode";
import { Callout, type CalloutTone } from "../../components/Callout";
import { type CompareOption, OptionCompare } from "../../components/OptionCompare";
import { PlanSummary, type Stat } from "../../components/PlanSummary";
import { type Risk, RiskList } from "../../components/RiskList";
import { SectionCard } from "../../components/SectionCard";
import { type Step, Steps } from "../../components/Steps";

export interface PlanNote {
  readonly tone: CalloutTone;
  readonly title?: string;
  readonly body: string;
}

export interface PlanBriefProps {
  readonly title: string;
  readonly summary?: ReadonlyArray<Stat>;
  readonly notes?: ReadonlyArray<PlanNote>;
  readonly steps?: ReadonlyArray<Step>;
  readonly options?: ReadonlyArray<CompareOption>;
  readonly risks?: ReadonlyArray<Risk>;
  readonly code?: {
    readonly label?: string;
    readonly code: string;
    readonly annotations: ReadonlyArray<Annotation>;
  };
  readonly details?: ReadonlyArray<{ readonly summary: string; readonly detail: string }>;
}

/**
 * The flagship: a whole agent plan on one readable page — a blast-radius summary, margin notes,
 * the ordered steps, the approaches weighed, the risks, one annotated key change, and foldaway
 * detail. Every section renders only when its data is present.
 */
export const PlanBrief = ({
  title,
  summary,
  notes,
  steps,
  options,
  risks,
  code,
  details,
}: PlanBriefProps) => {
  if (!title) throw new Error("PlanBrief: title is required");
  return (
    <div class="space-y-8">
      <SectionCard title={title} chip="agent plan">
        {summary && summary.length > 0 ? <PlanSummary stats={summary} /> : null}
      </SectionCard>
      {notes && notes.length > 0 ? (
        <div class="space-y-3">
          {notes.map((note) => (
            <Callout key={note.body} tone={note.tone} title={note.title}>
              {note.body}
            </Callout>
          ))}
        </div>
      ) : null}
      {steps && steps.length > 0 ? (
        <SectionCard title="Plan" chip="steps">
          <Steps items={steps} />
        </SectionCard>
      ) : null}
      {options && options.length > 0 ? (
        <SectionCard title="Approaches weighed" chip="brainstorm">
          <OptionCompare options={options} />
        </SectionCard>
      ) : null}
      {risks && risks.length > 0 ? (
        <SectionCard title="Risks" chip="tradeoffs">
          <RiskList items={risks} />
        </SectionCard>
      ) : null}
      {code ? (
        <SectionCard title="Key change" chip="annotated">
          <AnnotatedCode label={code.label} code={code.code} annotations={code.annotations} />
        </SectionCard>
      ) : null}
      {details && details.length > 0 ? (
        <SectionCard title="Details" chip="expand">
          <Accordion items={details} />
        </SectionCard>
      ) : null}
    </div>
  );
};
