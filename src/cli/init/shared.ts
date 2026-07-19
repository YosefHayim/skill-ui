import { homedir } from "node:os";
import { join } from "node:path";

/** The published package specifier every scaffolded on-ramp shells out to. */
export const PKG = "planpage";
export const SKILL_DIR = "render-plan";
export const CODEX_START = "<!-- planpage:start -->";
export const CODEX_END = "<!-- planpage:end -->";

export type AgentKey =
  | "claude"
  | "cursor"
  | "codex"
  | "windsurf"
  | "kiro"
  | "cline"
  | "copilot"
  | "amazonq"
  | "roo";

export const ALL_AGENTS: readonly AgentKey[] = [
  "claude",
  "cursor",
  "codex",
  "windsurf",
  "kiro",
  "cline",
  "copilot",
  "amazonq",
  "roo",
];

export interface InitCommandOptions {
  readonly agent?: string;
  readonly global?: boolean;
  readonly dir?: string;
  readonly force?: boolean;
}

export interface ScaffoldResult {
  readonly path: string;
  readonly status: "created" | "updated" | "skipped";
}

export const STATUS_MARK: Record<ScaffoldResult["status"], string> = {
  created: "✓ created",
  updated: "✓ updated",
  skipped: "· skipped",
};

/** The core instruction block — what to do when presenting a plan. */
export const planSteps = (): string =>
  [
    "1. Shape the plan as JSON for the `plan-brief` template (title · summary · steps · options · risks · code).",
    `2. Render + serve it: \`npx ${PKG} render plan-brief --data plan.json --serve --decision decision.json\` — it opens the browser and blocks until **Approve** / **Adjust**, and never hangs a non-TTY caller (it falls back to copy-paste).`,
    "3. Read `decision.json` — `{ approved, flips, revisit, notes }` — and act: on `approved:false`, re-open the picks named in `flips` / `revisit` and fold in `notes`.",
  ].join("\n");

/** The question-poll instruction block — for interview/grill flows. */
export const pollSteps = (): string =>
  [
    "",
    "### Interactive question flows (question-poll)",
    "",
    "When interviewing the user about preferences (code style, architecture, config):",
    "",
    "1. Shape questions as JSON: `{ title, layout?, questions: [{ id, text, group?, diagram?, options: [{ id, label, description?, code?, recommended? }] }] }`",
    `2. Render: \`npx ${PKG} render question-poll --data questions.json --serve --decision decision.json\``,
    "3. Read the decision — each answer includes `questionId`, `picked`, `questionText`, `chosenText`.",
    "",
    "Layout options: `stack` (default), `grid-2`, `grid-3`, `grid-4`, `grid-5`.",
    "Add `diagram` (Mermaid source) to any question for visual context.",
  ].join("\n");

/** The full instruction body used in all on-ramps. */
export const fullInstructions = (): string =>
  [planSteps(), pollSteps(), "", `Browse all components: \`npx ${PKG} library --open\`.`].join(
    "\n",
  );

/** Resolve Claude skill base dir for --global / --dir / default. */
export const claudeSkillsBase = (options: InitCommandOptions): string =>
  options.dir ?? join(options.global ? homedir() : ".", ".claude", "skills");
