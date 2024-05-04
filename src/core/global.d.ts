declare var IsDev: boolean;
declare var ModuleSymbol: typeof import("./module").ModuleSymbol;
declare var CurrentBunSai: import(".").BunSai | null;
declare var BrowserBuildPlugins: import("bun").BunPlugin[];
declare var ServerBuildPlugins: import("bun").BunPlugin[];

declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG?: string;
  }
}
