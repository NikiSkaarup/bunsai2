import type { Context } from "elysia";
import type { Attributes } from "./attrs";

export interface SvelteModuleProps {
  /**
   * Available only in dev mode
   */
  jsMap: object | undefined;
  css: string | null;
  cssHash: string | null;
  /**
   * Available only in dev mode
   */
  cssMap: object | null | undefined;
  /**
   * This property is masked on browser builds.
   */
  path: string;
}

export interface SvelteModuleComponent {
  render: (
    props: { context: Context | null; attrs: Attributes; isServer: boolean },
    options?: { context: Map<string, any> }
  ) => {
    head: string;
    html: string;
    css: {
      code: string;
      map: any;
    };
  };
}

export interface SvelteModule {
  $sv_meta: SvelteModuleProps;
  $sv_module: typeof SvelteModuleSymbol;

  default: SvelteModuleComponent;
}

export const SvelteModuleSymbol = Symbol("svelte.module");
