import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: SvelteConfig = {
  preprocess: [vitePreprocess()],
};

export default config;
