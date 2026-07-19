import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** Windsurf — a rule under `.windsurf/rules`. */
export const scaffoldWindsurf = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".windsurf", "rules", "planpage.md");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, windsurfRule());
  return { path: file, status: "created" };
};

function windsurfRule(): string {
  return [
    "# Render plans through planpage",
    "",
    "When presenting a plan, migration, or review-gate for approval, render it through the `planpage` package as a beautiful HTML page instead of plain text.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
