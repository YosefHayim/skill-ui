import { mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { serve } from "./serve";

describe("serve — dynamic port", () => {
  const blockers: ReturnType<typeof createServer>[] = [];

  afterEach(() => {
    for (const s of blockers) s.close();
    blockers.length = 0;
  });

  /** Occupy a port so serve has to find another one. */
  const blockPort = (port: number): Promise<void> =>
    new Promise((resolve) => {
      const blocker = createServer();
      blocker.listen(port, "127.0.0.1", () => {
        blockers.push(blocker);
        resolve();
      });
    });

  it("falls back to next port when preferred port is busy", async () => {
    const port = 19876;
    await blockPort(port);

    const tmp = mkdtempSync(join(tmpdir(), "planpage-serve-"));
    const htmlPath = join(tmp, "test.html");
    const outPath = join(tmp, "decision.json");
    writeFileSync(htmlPath, "<html><body>test</body></html>");

    // Start serve with the blocked port — it should pick port+1 or higher
    const result = serve({ htmlPath, outPath, port, timeoutSec: 2 });

    // Give it time to bind, then post a decision so it resolves
    await new Promise((r) => setTimeout(r, 200));

    // Find what port it actually bound to by checking stdout (it logs)
    // Instead, just POST to port+1 through port+10 to find it
    let found = false;
    for (let p = port + 1; p <= port + 11; p++) {
      try {
        const resp = await fetch(`http://127.0.0.1:${p}/decision`, {
          method: "POST",
          body: JSON.stringify({ approved: true }),
        });
        if (resp.ok) {
          found = true;
          break;
        }
      } catch {
        // port not listening, try next
      }
    }

    const exitCode = await result;
    expect(found).toBe(true);
    expect(exitCode).toBe(0);
  });
});
