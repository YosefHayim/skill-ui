import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { type IncomingMessage, createServer } from "node:http";
import type { AddressInfo } from "node:net";

export interface ServeOptions {
  readonly htmlPath: string;
  readonly outPath: string;
  /** Idle timeout before giving up on a decision. Default 600s. */
  readonly timeoutSec?: number;
  /** Fixed port; default 0 = an OS-assigned ephemeral port (49152+), so it never clashes. */
  readonly port?: number;
}

/**
 * Serve an HTML plan on loopback, open the browser, and block until the page POSTs one
 * decision (or the idle timeout fires). Writes the decision JSON verbatim and resolves an
 * exit code: 0 = decision written · 2 = server/IO error · 3 = timeout. Never hangs a caller.
 *
 * @returns the process exit code to use
 */
export const serve = ({
  htmlPath,
  outPath,
  timeoutSec = 600,
  port = 0,
}: ServeOptions): Promise<number> => {
  const html = readFileSync(htmlPath);
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      if (req.method === "POST" && req.url === "/decision") {
        collectDecision(
          req,
          () => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(
              "<body style='font:16px system-ui;padding:3rem'>Decision received — return to your terminal.</body>",
            );
            server.close(() => resolve(0));
          },
          outPath,
        );
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });

    server.on("error", () => resolve(2));
    server.listen(port, "127.0.0.1", () => {
      const address = server.address() as AddressInfo;
      const url = `http://127.0.0.1:${address.port}/`;
      process.stdout.write(`planpage: serving ${url}\n`);
      process.stdout.write("planpage: waiting for your decision (Approve / Adjust)…\n");
      openBrowser(url);
    });

    const idle = setTimeout(() => {
      process.stderr.write("planpage: timed out waiting for a decision\n");
      server.close(() => resolve(3));
    }, timeoutSec * 1000);
    idle.unref();
  });
};

function collectDecision(req: IncomingMessage, onDone: () => void, outPath: string): void {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    writeFileSync(outPath, body || "{}");
    process.stdout.write(`planpage: decision written to ${outPath}\n`);
    onDone();
  });
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(cmd, [url], {
      stdio: "ignore",
      detached: true,
      shell: process.platform === "win32",
    }).unref();
  } catch {
    process.stdout.write(`planpage: open manually → ${url}\n`);
  }
}
