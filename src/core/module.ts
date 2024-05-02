import type { Context } from "elysia";
import type { Attributes } from "./attrs";
import type { ScriptData } from "./script";

export interface ModuleProps {
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

export interface ModuleComponent {}

export type ModuleRenderer = (
  props: {
    context: Record<string, any>;
    attrs: Attributes;
    isServer: boolean;
  },
  options?: { context: Map<string, any> }
) => {
  head: string;
  html: string;
  css: {
    code: string;
    map: any;
  };
};

export interface Module {
  $m_meta: ModuleProps;
  $m_symbol: typeof ModuleSymbol;
  $m_render: ModuleRenderer;
  $m_gen_script(data: ScriptData): string;
}

export const ModuleSymbol = Symbol("svelte.module");
