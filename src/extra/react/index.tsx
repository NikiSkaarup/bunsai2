import { type ReactNode } from "react";
import type { ModuleRenderProps, StandaloneModule } from "../../core/module";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { genScript } from "./script";
import { ModuleSymbol } from "../../core/globals";
import { register } from "../../core/register";

export interface ReactModuleDeclaration<Context extends Record<string, any>> {
  component: (props: ModuleRenderProps<Context>) => ReactNode;
  head?: () => ReactNode;
  importMeta: ImportMeta;
}

export interface ReactModule<Context extends Record<string, any>> {
  (props: ModuleRenderProps<Context>): ReactNode;
  head?: () => ReactNode;
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
  const retorno: StandaloneModule<Context> = {
    $m_symbol: ModuleSymbol,
    $m_meta: {
      css: null,
      cssHash: "",
      cssMap: null,
      jsMap: null,
      path: Bun.fileURLToPath(Module.importMeta.url),
    },
    $m_gen_script: genScript,
    $m_render(props) {
      return {
        head: renderToStaticMarkup(Module.head && <Module.head />),
        html: renderToString(<Module {...props} />),
      };
    },
    render: function (context: Context): Response {
      throw new Error("Function not implemented.");
    },
  };

  retorno.render = register(retorno);

  return retorno;
}

export { default as React } from "react";
