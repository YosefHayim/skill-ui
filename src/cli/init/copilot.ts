import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** GitHub Copilot — instructions under `.github/copilot-instructions.md`. */
export const scaffoldCopilot = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".github", "copilot-instructions.md");
  const block = copilotBlock();
  if (!existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, block);
    return { path: file, status: "created" };
  }
  const current = readFileSync(file, "utf8");
  if (current.includes("planpage")) {
    if (!options.force) return { path: file, status: "skipped" };
    const updated = current.replace(/## planpage[\s\S]*?(?=\n## |\n$|$)/, block.trim());
    writeFileSync(file, updated);
    return { path: file, status: "updated" };
  }
  const separator = current.endsWith("\n") ? "\n" : "\n\n";
  appendFileSync(file, `${separator}${block}`);
  return { path: file, status: "updated" };
};

function copilotBlock(): string {
  return [
    "## planpage",
    "",
    "When presenting a plan or review-gate for approval, render it through the `planpage` package as a self-contained HTML page instead of text.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
