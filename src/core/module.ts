import type { Attributes } from "./attrs";
import type { ScriptData } from "./script";
import type { StandaloneRenderer } from "./register";

export interface ModuleProps {
  /**
   * Module scoped css
   */
  css: string | null;
  cssHash: string;
  path: string;
}

export interface ModuleComponent {}

export interface ModuleRenderProps<Context extends Record<string, any>> {
  context: Context;
  attrs: Attributes;
  isServer: boolean;
}

export type ModuleRenderer<Context extends Record<string, any>> = (
  props: ModuleRenderProps<Context>
) => {
  head: string;
  html: string;
  css: string;
};

export interface Module<
  Context extends Record<string, any> = Record<string, any>
> {
  $m_meta: ModuleProps;
  $m_symbol: typeof ModuleSymbol;
  $m_render: ModuleRenderer<Context>;

  /**
   * Client side hydration script tag generator
   */
  $m_gen_script(data: ScriptData): string;
}

export interface StandaloneModule<
  Context extends Record<string, any> = Record<string, any>
> extends Module<Context> {
  render: StandaloneRenderer<Context>;
}

export const ModuleSymbol = Symbol("bunsai.module");
