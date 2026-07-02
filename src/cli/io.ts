import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Write HTML to a unique temp file (keyed by pid) and return its path. */
export const writeTemp = (html: string): string => {
  const path = join(tmpdir(), `skill-ui-${process.pid}.html`);
  writeFileSync(path, html);
  return path;
};

/** Open a file or URL in the OS default handler, detached — never blocks or throws into the caller. */
export const openPath = (path: string): void => {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(cmd, [path], {
    stdio: "ignore",
    detached: true,
    shell: process.platform === "win32",
  }).unref();
};
