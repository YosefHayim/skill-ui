import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** Kiro — a steering file under `.kiro/steering`. */
export const scaffoldKiro = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".kiro", "steering", "planpage.md");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, kiroSteering());
  return { path: file, status: "created" };
};

function kiroSteering(): string {
  return [
    "# planpage — render plans as interactive HTML",
    "",
    "When presenting a plan, review-gate, or collecting user preferences, render through the `planpage` package instead of plain text output.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
