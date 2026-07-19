import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type InitCommandOptions, type ScaffoldResult, fullInstructions } from "./shared";

/** Cursor — a project rule under `.cursor/rules`. */
export const scaffoldCursor = (options: InitCommandOptions): ScaffoldResult => {
  const file = join(".", ".cursor", "rules", "planpage.mdc");
  if (existsSync(file) && !options.force) {
    return { path: file, status: "skipped" };
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, cursorRule());
  return { path: file, status: "created" };
};

function cursorRule(): string {
  return [
    "---",
    "description: Render plans and review-gates as beautiful HTML via planpage, then collect one approve/adjust decision back. Apply at any plan or approval step.",
    "alwaysApply: false",
    "---",
    "",
    "# Render plans through planpage",
    "",
    "When you present a plan, migration, or review-gate for approval, don't dump it as text. Render it through the `planpage` package and let me approve or adjust it in the browser.",
    "",
    fullInstructions(),
    "",
  ].join("\n");
}
