import type { Context } from "elysia";
import type { Attributes } from "./attrs";
import type { ScriptData } from "./script";
import type { StandaloneRenderer } from "./register";

export interface ModuleProps {
  jsMap: object | undefined;
  css: string | null;
  cssHash: string | null;
  cssMap: object | null | undefined;
  path: string;
}

export interface ModuleComponent {}

export type ModuleRenderer = (props: {
  context: Record<string, any>;
  attrs: Attributes;
  isServer: boolean;
}) => {
  head: string;
  html: string;
};

export interface Module {
  $m_meta: ModuleProps;
  $m_symbol: typeof ModuleSymbol;
  $m_render: ModuleRenderer;
  $m_gen_script(data: ScriptData): string;

  render: StandaloneRenderer;
}

export const ModuleSymbol = Symbol("bunsai.module");
