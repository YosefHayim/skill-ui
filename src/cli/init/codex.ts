import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CODEX_END,
  CODEX_START,
  type InitCommandOptions,
  type ScaffoldResult,
  fullInstructions,
} from "./shared";

/** Codex — a delimited block in `AGENTS.md`; appended/refreshed, never clobbering existing rules. */
export const scaffoldCodex = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", "AGENTS.md");
  const block = codexBlock();
  if (!existsSync(file)) {
    writeFileSync(file, `# AGENTS.md\n\n${block}`);
    return { path: file, status: "created" };
  }
  const current = readFileSync(file, "utf8");
  const start = current.indexOf(CODEX_START);
  if (start === -1) {
    const separator = current.endsWith("\n") ? "\n" : "\n\n";
    appendFileSync(file, `${separator}${block}`);
    return { path: file, status: "updated" };
  }
  if (!options.force) {
    return { path: file, status: "skipped" };
  }
  const end = current.indexOf(CODEX_END);
  const tail = end === -1 ? "" : current.slice(end + CODEX_END.length);
  writeFileSync(file, `${current.slice(0, start)}${block}${tail.replace(/^\n+/, "\n")}`);
  return { path: file, status: "updated" };
};

function codexBlock(): string {
  return [
    CODEX_START,
    "## Rendering plans (planpage)",
    "",
    "When you present a plan or review-gate for approval, render it through the `planpage` package instead of dumping text:",
    "",
    fullInstructions(),
    CODEX_END,
    "",
  ].join("\n");
}
