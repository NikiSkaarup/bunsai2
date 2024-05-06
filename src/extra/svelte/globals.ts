import { createHolder } from "../../core/util";
import type { ResolvedSvelteConfig } from "./config";

export const SvelteHydratable = createHolder<boolean>(),
  SvelteResolvedConfig = createHolder<ResolvedSvelteConfig>();
