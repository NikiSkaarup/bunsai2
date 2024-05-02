import type { ModuleRenderer } from "./module";

export interface ScriptData {
  clientPath: string;
  props: Parameters<ModuleRenderer>[0];
}
