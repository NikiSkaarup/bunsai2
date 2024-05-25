import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: SvelteConfig = {
  preprocess: [vitePreprocess()],
  bunsai2: {
    ignore: { extend: ["**/$*"] },
  },
};

export default config;
