/// <reference path="./global.d.ts"/>

import type { Attributes } from "./attrs";
import type { Module } from "./module";
import { buildClient, type BuildResult } from "./build";
import { render } from "./render";
import { processRenderAttrs } from "./attrs";
import { genCSS } from "./css";
import { Util } from "./util";
import { CurrentBunSai } from "./globals";

export interface BunSai {
  declarations: { path: string; handle: () => Response }[];
  render<Context extends Record<string, any>>(
    module: Module<Context>,
    context: Context
  ): Response;
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

export default async function bunsai(
  config: BunsaiConfig = {}
): Promise<BunSai> {
  const { prefix = "/__bunsai__/", defaults } = config;

  const result = await buildClient(prefix);

  if (!result) {
    Util.log.loud("empty client endpoints. No module was registered");

    const retorno = {
      declarations: [],
      render() {
        return new Response("empty client endpoints", {
          status: 500,
          statusText: "empty client endpoints",
        });
      },
    };

    CurrentBunSai(retorno);

    return retorno;
  }

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

      return render({
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

  Util.log.verbose("client endpoints (", paths.join(" | "), ")");

  CurrentBunSai(retorno);

  return retorno;
}

export type { Attributes as RenderAttributes };
