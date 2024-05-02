/// <reference path="./global.d.ts"/>

import type { Attributes } from "./attrs";
import type { Module } from "./module";
import { buildClient, type BuildResult } from "./build";
import { render } from "./render";
import { processRenderAttrs } from "./attrs";
import { genCSS } from "./css";
import { Util } from "./util";

export interface BunSai {
  declarations: { path: string; handle: () => Response }[];
  render(module: Module, context: Record<string, any>): Response;
}

export interface BunsaiConfig {
  /**
   * Where the client build will be served.
   *
   * @default '/__bunsai__/'
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

export default async function bunsai(
  config: BunsaiConfig = {}
): Promise<BunSai | void> {
  const { prefix = "/__bunsai__/", defaults } = config;

  const result = await buildClient(prefix);

  if (!result) return;

  const paths: string[] = [];

  const manifest: BuildResult[] = result.extra.concat(
    Array.from(result.entries.values())
  );

  const retorno: BunSai = {
    render: (module, context) => {
      const { $m_meta: meta, $m_render, $m_gen_script } = module;

      const attrs: Attributes = {};

      const { head, html } = $m_render({ context, attrs, isServer: true });

      const { path } = result.entries.get(meta.path)!;

      return render(rootHTML, {
        ...processRenderAttrs(attrs, defaults?.attrs),
        body_content: html,
        head_content: head + genCSS({ meta, prefix }),
        script_content: $m_gen_script({
          clientPath: path,
          props: {
            context,
            attrs,
            isServer: false,
          },
        }),
      });
    },
    declarations: [],
  };

  for (const { object, path } of manifest) {
    paths.push(path);

    retorno.declarations.push({
      path,
      handle: () =>
        new Response(object, { headers: { "content-type": object.type } }),
    });
  }

  Util.log.debug("client endpoints (", paths.join(" | "), ")");

  return retorno;
}

export type { Attributes as RenderAttributes };
