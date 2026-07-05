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

  /** Occupy a port so serve has to pick another one. */
  const blockPort = (port: number): Promise<number> =>
    new Promise((resolve) => {
      const blocker = createServer();
      blocker.listen(port, "127.0.0.1", () => {
        blockers.push(blocker);
        resolve(port);
      });
    });

  it("auto-picks an available port when preferred is busy", async () => {
    const preferredPort = 19876;
    await blockPort(preferredPort);

    const tmp = mkdtempSync(join(tmpdir(), "planpage-serve-"));
    const htmlPath = join(tmp, "test.html");
    const outPath = join(tmp, "decision.json");
    writeFileSync(htmlPath, "<html><body>test</body></html>");

    // Start serve — preferred port is blocked, so it should auto-pick another
    const result = serve({ htmlPath, outPath, port: preferredPort, timeoutSec: 2 });

    // Wait for bind then let it timeout — exit 3 means it bound successfully and waited
    const exitCode = await result;
    expect(exitCode).toBe(3);
  }, 10_000);
});
