import { createHolder, type Holder } from "../../core/util";
import type { ResolvedSvelteConfig } from "./config";

const $global: any = global;

export const SvelteHydratable: Holder<boolean> =
  ($global.$$$bunsai_svelte_svelte_hydrateable ||= createHolder());

export const SvelteResolvedConfig: Holder<ResolvedSvelteConfig> =
  ($global.$$$bunsai_svelte_svelte_resolved_config ||= createHolder());
