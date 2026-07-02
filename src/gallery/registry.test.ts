import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentNames, diffRegistry } from "./capture";
import { GALLERY } from "./registry";

describe("gallery registry", () => {
  it("captures every component — no drift vs src/components", () => {
    const files = readdirSync(new URL("../components", import.meta.url)).map(String);
    const diff = diffRegistry(componentNames(files), Object.keys(GALLERY));
    expect(diff).toEqual({ missing: [], extra: [] });
  });
});
