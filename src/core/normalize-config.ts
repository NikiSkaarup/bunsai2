import type { BunsaiConfig } from ".";
import { resolve } from "path";

export function normalizeConfig(
  config: BunsaiConfig | undefined
): Required<BunsaiConfig> {
  return {
    defaults: config?.defaults || {},
    prefix: config?.prefix || "/__bunsai__/",
    root: (config?.root && resolve(config.root)) || process.cwd(),
  };
}
