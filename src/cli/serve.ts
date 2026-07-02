import { serve } from "../server/serve";

export interface ServeCommandOptions {
  readonly timeout?: string;
}

/** `planpage serve <html> <out>` — serve an existing HTML file and collect one decision. */
export const serveCommand = async (
  htmlPath: string,
  outPath: string,
  options: ServeCommandOptions,
): Promise<void> => {
  const code = await serve({ htmlPath, outPath, timeoutSec: Number(options.timeout) || 600 });
  process.exit(code);
};
