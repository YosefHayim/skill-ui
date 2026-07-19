import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** Cline — a rule under `.clinerules`. */
export const scaffoldCline = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".clinerules", "planpage.md");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, clineRule());
  return { path: file, status: "created" };
};

function clineRule(): string {
  return [
    "# planpage — interactive plan rendering",
    "",
    "At any plan or approval step, render through the `planpage` package to produce a beautiful, self-contained HTML page. Never dump long plans as raw text.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
