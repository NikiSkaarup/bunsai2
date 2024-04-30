import type { SvelteConfig } from "elysia-plugin-svelte";
import preprocess from "svelte-preprocess";

const config: SvelteConfig = {
  preprocess: preprocess(),
};

export default config;
