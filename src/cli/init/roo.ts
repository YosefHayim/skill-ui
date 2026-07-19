import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** Roo Code — a rule under `.roo/rules`. */
export const scaffoldRoo = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".roo", "rules", "planpage.md");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, rooRule());
  return { path: file, status: "created" };
};

function rooRule(): string {
  return [
    "# planpage — interactive plan rendering",
    "",
    "At any plan or approval step, render through the `planpage` package to produce a beautiful, self-contained HTML page instead of dumping text.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
