/// <reference path="./global.d.ts"/>

import Elysia from "elysia";
import type { Attributes } from "./attrs";
import type { Module } from "./module";
import { buildClient, type BuildResult } from "./build";
import { render } from "./render";
import { genScript, type ScriptData } from "./script";
import { processRenderAttrs } from "./attrs";
import { genCSS } from "./css";

export interface Router {
  get(path: string, handler: () => Response): any;
  onAfterHandle(
    handler: (args: {
      response: unknown;
      [key: string]: any;
    }) => Response | void
  ): any;
}

export interface CodeGenerator {
  script(data: ScriptData): string;
}

export interface PluginConfig {
  router: Router;
  /**
   * Where the client build will be served.
   *
   * @default '/__dynamic__/'
   */
  prefix?: string;
  /**
   * To be applied on builds
   */
  defaults?: {
    attrs?: Attributes;
  };
}

const rootHTML = await Bun.file(
  Bun.fileURLToPath(import.meta.resolve("./root.html"))
).text();

export default async function sveltePlugin(config: PluginConfig) {
  const { prefix: sveltePrefix = "/__dynamic__/", defaults, router } = config;

  const result = await buildClient(sveltePrefix);

  if (!result) return router;

  const paths: string[] = [];

  const manifest: BuildResult[] = result.extra.concat(
    Array.from(result.entries.values())
  );

  for (const { object, path } of manifest) {
    paths.push(path);

    router.get(
      path,
      () => new Response(object, { headers: { "content-type": object.type } })
    );
  }

  router.onAfterHandle(({ response, ...context }) => {
    if ((<Module>response)?.$m_symbol !== SvelteModuleSymbol) return;

    const {
      $m_meta: meta,
      default: { render: component },
    } = <Module>response;

    const attrs: Attributes = {};

    const { head, html } = component({ context, attrs, isServer: true });

    const { path } = result.entries.get(meta.path)!;

    return render(rootHTML, {
      ...processRenderAttrs(attrs, defaults?.attrs),
      body_content: html,
      head_content: head + genCSS({ meta, sveltePrefix }),
      script_content: genScript({ clientPath: path }),
    });
  });

  if (Bun.env.DEBUG)
    console.log("[svelte]: client endpoints (", paths.join(" | "), ")");

  return router;
}

export type { Config as SvelteConfig } from "./svelte";
export type { Attributes as RenderAttributes };
