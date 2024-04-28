import Elysia from "elysia";
import getSvelteConfig from "./svelte";
import createPlugins from "./plugins";
import type { RenderAttrs } from "./attrs";

export interface SveltePluginConfig {
  /**
   * The root folder where all svelte files are located
   */
  root: string;
  defaults?: {
    attrs?: RenderAttrs;
  };
}

export default async function sveltePlugin(config: SveltePluginConfig) {
  const svConfig = await getSvelteConfig();

  const { browser, bun } = createPlugins(
    svConfig,
    svConfig.compilerOptions.dev ?? Bun.env.NODE_ENV != "production"
  );

  Bun.plugin(bun);

  return new Elysia({
    name: "elysia-plugin-svelte",
    seed: { name: "elysia-plugin-svelte" },
  });
}

export type { Config as SvelteConfig } from "./svelte";
