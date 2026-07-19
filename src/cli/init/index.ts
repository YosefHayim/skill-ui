import { scaffoldAmazonQ } from "./amazonq";
import { scaffoldClaude } from "./claude";
import { scaffoldCline } from "./cline";
import { scaffoldCodex } from "./codex";
import { scaffoldCopilot } from "./copilot";
import { scaffoldCursor } from "./cursor";
import { scaffoldKiro } from "./kiro";
import { scaffoldRoo } from "./roo";
import {
  ALL_AGENTS,
  type AgentKey,
  type InitCommandOptions,
  PKG,
  STATUS_MARK,
  type ScaffoldResult,
} from "./shared";
import { scaffoldWindsurf } from "./windsurf";

export type { InitCommandOptions } from "./shared";

/**
 * `planpage init` — wire planpage into your agents so they render every plan gate through the kit.
 * Writes one small, idempotent on-ramp per agent. Supports: Claude Code, Cursor, Codex (AGENTS.md),
 * Windsurf, Kiro, Cline, GitHub Copilot, Amazon Q, and Roo Code. Never clobbers — an existing
 * on-ramp is skipped unless `--force`. `--agent` narrows the set; default is all.
 */
export const initCommand = (options: InitCommandOptions): void => {
  const writers: Record<AgentKey, (options: InitCommandOptions) => ScaffoldResult> = {
    claude: scaffoldClaude,
    cursor: scaffoldCursor,
    codex: scaffoldCodex,
    windsurf: scaffoldWindsurf,
    kiro: scaffoldKiro,
    cline: scaffoldCline,
    copilot: scaffoldCopilot,
    amazonq: scaffoldAmazonQ,
    roo: scaffoldRoo,
  };
  const results = resolveAgents(options.agent).map((agent) => writers[agent](options));
  const summary = results
    .map((result) => {
      const note = result.status === "skipped" ? "  (exists — pass --force to overwrite)" : "";
      return `  ${STATUS_MARK[result.status]}  ${result.path}${note}`;
    })
    .join("\n");
  process.stdout.write(
    [
      `planpage: wired up ${results.length} agent on-ramp${results.length === 1 ? "" : "s"} —`,
      summary,
      "",
      `  → install the kit:  npm i -D ${PKG}`,
      "  → your agents now render their plan gate through planpage.",
      "",
    ].join("\n"),
  );
};

/** Turn the `--agent` flag (`claude,cursor` · `all` · unset) into a concrete, validated set. */
const resolveAgents = (raw: string | undefined): AgentKey[] => {
  if (!raw || raw === "all") {
    return [...ALL_AGENTS];
  }
  const requested = raw.split(",").map((token) => token.trim().toLowerCase());
  const chosen = ALL_AGENTS.filter((agent) => requested.includes(agent));
  if (chosen.length === 0) {
    throw new Error(`--agent must be one of: ${ALL_AGENTS.join(", ")}, all (got "${raw}")`);
  }
  return chosen;
};
