/// <reference path="./global.d.ts"/>

import Elysia from "elysia";
import type { Attributes } from "./attrs";
import type { SvelteModule } from "./module";
import { buildClient } from "./build";
import { render } from "./root";
import { genScript } from "./script";
import { processRenderAttrs } from "./attrs";

export interface SveltePluginConfig {
  /**
   * Where the client build will be served.
   *
   * @default '/__sv__/'
   */
  sveltePrefix?: string;
  defaults?: {
    attrs?: Attributes;
  };
}

const rootHTML = await Bun.file(
  Bun.fileURLToPath(import.meta.resolve("./root.html"))
).text();

export default async function sveltePlugin(config: SveltePluginConfig = {}) {
  const { sveltePrefix = "/__sv__/", defaults } = config;

  const result = await buildClient(sveltePrefix);

  const plugin = new Elysia({
    name: "elysia-plugin-svelte",
    seed: { name: "elysia-plugin-svelte" },
  });

  if (!result) return plugin;

  plugin.onAfterHandle({ as: "global" }, ({ response, ...context }) => {
    if ((<SvelteModule>response)?.$sv_module !== SvelteModuleSymbol) return;

    const {
      $sv_meta,
      default: { render: sv },
    } = <SvelteModule>response;

    const attrs: Attributes = {};

    const { head, html } = sv({ context, attrs });

    const { path } = result.entries.get($sv_meta.path)!;

    return render(rootHTML, {
      ...processRenderAttrs(attrs, defaults?.attrs),
      body_content: html,
      head_content:
        head + ($sv_meta.css ? `<style>${$sv_meta.css}</style>` : ""),
      script_content: genScript(path, context),
    });
  });

  const paths: string[] = [];

  const manifest = result.extra.concat(Array.from(result.entries.values()));

  for (const { object, path } of manifest) {
    paths.push(path);

    plugin.get(
      path,
      () => new Response(object, { headers: { "content-type": object.type } })
    );
  }

  console.log("[svelte]: client endpoints (", paths.join(" | "), ")");

  return plugin;
}

export type { Config as SvelteConfig } from "./svelte";
export type { Attributes as RenderAttributes };
