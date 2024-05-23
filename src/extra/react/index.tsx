import React, { type ReactNode } from "react";
import type { ModuleRenderProps, StandaloneModule } from "../../core/module";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { genScript } from "./script";
import { ModuleSymbol } from "../../core/globals";
import { register } from "../../core/register";

export interface ReactModuleDeclaration<Context extends Record<string, any>> {
  component: (props: ModuleRenderProps<Context>) => ReactNode;
  head?: (props: ModuleRenderProps<Context>) => ReactNode;
  importMeta: ImportMeta;
}

export interface ReactModule<Context extends Record<string, any>> {
  (props: ModuleRenderProps<Context>): ReactNode;
  head?: (props: ModuleRenderProps<Context>) => ReactNode;
  importMeta: ImportMeta;
  $hydrate(props: ModuleRenderProps<Context>): void;
}

export type ReactProps<Context extends Record<string, any> = {}> =
  ModuleRenderProps<Context>;

export function make<Context extends Record<string, any>>(
  decl: ReactModuleDeclaration<Context>
): ReactModule<Context> {
  const Module = decl.component;
  return Object.assign(Module, {
    importMeta: decl.importMeta,
    head: decl.head,
    $hydrate(props: ModuleRenderProps<Context>) {
      hydrateRoot((window as any).$root, <Module {...props} />);
    },
  });
}

/**
 * Transform a {@link ReactModule} (previously built using {@link make}) into a BunSai Module.
 */
export function react<Context extends Record<string, any>>(
  Module: ReactModule<Context>
): StandaloneModule<Context> {
  const $m_symbol: typeof ModuleSymbol = ModuleSymbol,
    $m_meta = {
      css: null,
      cssHash: "",
      cssMap: null,
      jsMap: null,
      path: Bun.fileURLToPath(Module.importMeta.url),
    },
    $m_gen_script = genScript,
    $m_render = (props: ModuleRenderProps<Context>) => {
      return {
        head: renderToStaticMarkup(Module.head && <Module.head {...props} />),
        html: renderToString(<Module {...props} />),
      };
    };

  return {
    $m_gen_script,
    $m_meta,
    $m_render,
    $m_symbol,
    render: register<Context>({
      $m_symbol,
      $m_meta,
      $m_gen_script,
      $m_render,
    }),
  };
}

/**
 * Construct a table of BunSai Modules.
 *
 * @example
 * import TestReact from "../react/test.tsx";
 * import { table } from "bunsai/react";
 *
 * TestReact // -> ReactModule
 * const t = table({ TestReact });
 * t.TestReact // -> StandaloneModule
 *
 *
 */
export function table<Data extends Record<string, ReactModule<any>>>(
  data: Data
): ModuleTable<Data> {
  const retorno = {} as any;

  for (const [key, value] of Object.entries(data)) {
    retorno[key] = react(value);
  }

  return retorno;
}

export type ModuleTable<Data extends Record<string, ReactModule<any>>> = {
  [K in keyof Data]: Data[K] extends ReactModule<infer T>
    ? StandaloneModule<T>
    : never;
};

export { React };
