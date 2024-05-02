import type { SvelteConfig } from "bunsai2";
import preprocess from "svelte-preprocess";

const config: SvelteConfig = {
  preprocess: preprocess(),
};

export default config;
