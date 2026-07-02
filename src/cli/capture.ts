import { readdirSync } from "node:fs";
import { componentNames, diffRegistry } from "../gallery/capture";
import { GALLERY } from "../gallery/registry";

export interface CaptureCommandOptions {
  /** Exit non-zero on drift, for CI. */
  readonly check?: boolean;
}

/**
 * `skill-ui capture` — report components in src/components that are missing from the gallery
 * registry (and stale entries that are registered but gone). A dev tool: run from source, where
 * the .tsx files exist. The gallery-sync test is the enforced guarantee; this is the fast local check.
 */
export const captureCommand = (options: CaptureCommandOptions): void => {
  const onDisk = componentNames(
    readdirSync(new URL("../components/", import.meta.url)).map(String),
  );
  const diff = diffRegistry(onDisk, Object.keys(GALLERY));

  if (diff.missing.length === 0 && diff.extra.length === 0) {
    process.stdout.write("skill-ui: gallery is in sync ✓\n");
    return;
  }
  for (const name of diff.missing) {
    process.stdout.write(stub(name));
  }
  if (diff.extra.length > 0) {
    process.stdout.write(`skill-ui: registered but not on disk: ${diff.extra.join(", ")}\n`);
  }
  if (options.check) {
    process.exit(2);
  }
};

function stub(name: string): string {
  return `# add to src/gallery/registry.tsx (fill blurb/usage/props):
  ${name}: {
    category: "TODO",
    blurb: "TODO",
    usage: "<${name} … />",
    props: [],
    sample: () => <${name} />,
  },
`;
}
