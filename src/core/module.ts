import type { Attributes } from "./attrs";
import type { ScriptData } from "./script";
import type { StandaloneRenderer } from "./register";

export interface ModuleProps {
  jsMap: object | null | undefined;
  css: string | null;
  cssHash: string | null;
  cssMap: object | null | undefined;
  path: string;
}

export interface ModuleComponent {}

export type ModuleRenderer<Context extends Record<string, any>> = (props: {
  context: Context;
  attrs: Attributes;
  isServer: boolean;
}) => {
  head: string;
  html: string;
};

export interface Module<
  Context extends Record<string, any> = Record<string, any>
> {
  $m_meta: ModuleProps;
  $m_symbol: typeof ModuleSymbol;
  $m_render: ModuleRenderer<Context>;
  $m_gen_script(data: ScriptData): string;
}

export const ModuleSymbol = Symbol("bunsai.module");
