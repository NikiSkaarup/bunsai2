import type { ModuleRenderer } from "./module";

export interface ScriptData<
  Context extends Record<string, any> = Record<string, any>
> {
  clientPath: string;
  props: Parameters<ModuleRenderer<Context>>[0];
}
