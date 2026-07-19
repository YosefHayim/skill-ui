import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  type InitCommandOptions,
  PKG,
  SKILL_DIR,
  type ScaffoldResult,
  claudeSkillsBase,
  fullInstructions,
} from "./shared";

/** Claude Code — a `render-plan` skill under `.claude/skills` (or `~/.claude` with --global). */
export const scaffoldClaude = (options: InitCommandOptions): ScaffoldResult => {
  const base = claudeSkillsBase(options);
  const file = join(base, SKILL_DIR, "SKILL.md");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, claudeSkill());
  return { path: file, status: "created" };
};

function claudeSkill(): string {
  return [
    "---",
    "name: render-plan",
    `description: Render this agent's plan / review-gate as a beautiful, self-contained HTML page and collect one approve/adjust decision back — powered by ${PKG}. Use at any plan or approval step.`,
    "---",
    "",
    "# render-plan — show the plan, get a decision",
    "",
    `At a planning or approval step, don't dump the plan as text. Render it through **${PKG}** and let the developer approve or adjust it in the browser.`,
    "",
    "## Steps",
    "",
    fullInstructions(),
    "",
    "## Rules",
    "",
    "- Always render at the gate; never ask for approval in plain text when this skill is installed.",
    `- Browse the available components any time: \`npx ${PKG} library --open\`.`,
    "",
  ].join("\n");
}
