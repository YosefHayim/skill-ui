import { createInterface } from "node:readline/promises";
import { TEMPLATES } from "../templates";
import { renderCommand } from "./render";

/** The interactive front door: bare `skill-ui` in a TTY previews a template from sample data. */
export const runMenu = async (): Promise<void> => {
  const names = Object.keys(TEMPLATES);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  process.stdout.write("\nskill-ui — pick a template to preview (sample data):\n");
  names.forEach((name, i) => process.stdout.write(`  ${i + 1}. ${name}\n`));
  const answer = await rl.question("\nnumber (or q to quit): ");
  rl.close();

  const name = names[Number(answer) - 1];
  if (!name) {
    process.stdout.write("nothing selected.\n");
    return;
  }
  await renderCommand(name, { sample: true, open: true });
};
