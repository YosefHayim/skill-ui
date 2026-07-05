import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { type IncomingMessage, createServer } from "node:http";
import type { AddressInfo, Server } from "node:net";

/** Maximum retries when a fixed port is busy before falling back to OS-assigned. */
const PORT_RETRIES = 10;

export interface ServeOptions {
  readonly htmlPath: string;
  readonly outPath: string;
  /** Idle timeout before giving up on a decision. Default 600s. */
  readonly timeoutSec?: number;
  /** Preferred port. If busy, retries up to 10 consecutive ports, then falls back to OS-assigned. Default 0 = ephemeral. */
  readonly port?: number;
}

/**
 * Serve an HTML plan on loopback, open the browser, and block until the page POSTs one
 * decision (or the idle timeout fires). Writes the decision JSON verbatim and resolves an
 * exit code: 0 = decision written · 2 = server/IO error · 3 = timeout. Never hangs a caller.
 *
 * If a specific port is requested but busy, automatically tries the next consecutive ports
 * (up to 10 attempts) before falling back to an OS-assigned ephemeral port.
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

    listenWithRetry(server, port, (listenError) => {
      if (listenError) {
        process.stderr.write(`planpage: could not bind to any port — ${listenError.message}\n`);
        resolve(2);
        return;
      }
      const address = server.address() as AddressInfo;
      const url = `http://127.0.0.1:${address.port}/`;
      if (port !== 0 && address.port !== port) {
        process.stdout.write(`planpage: port ${port} busy, using ${address.port} instead\n`);
      }
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

/**
 * Try to listen on `port`. If it's busy (EADDRINUSE), retry the next consecutive ports
 * up to PORT_RETRIES times, then fall back to 0 (OS-assigned). Calls `cb` on success or
 * final failure.
 */
function listenWithRetry(server: Server, port: number, cb: (err: Error | null) => void): void {
  // Port 0 means let the OS pick — no retry needed
  if (port === 0) {
    server.once("error", (err) => cb(err));
    server.listen(0, "127.0.0.1", () => cb(null));
    return;
  }

  let attempt = 0;
  const tryPort = (p: number): void => {
    const onError = (err: NodeJS.ErrnoException): void => {
      server.removeListener("error", onError);
      if (err.code === "EADDRINUSE") {
        attempt++;
        if (attempt < PORT_RETRIES) {
          tryPort(p + 1);
        } else {
          // Exhausted retries — fall back to ephemeral
          server.once("error", (fallbackErr) => cb(fallbackErr));
          server.listen(0, "127.0.0.1", () => cb(null));
        }
      } else {
        cb(err);
      }
    };
    server.once("error", onError);
    server.listen(p, "127.0.0.1", () => {
      server.removeListener("error", onError);
      cb(null);
    });
  };
  tryPort(port);
}

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
