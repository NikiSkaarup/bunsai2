declare var SvelteModuleSymbol: typeof import("./module").SvelteModuleSymbol;

declare var SvelteResolvedConfig: import("./svelte").ResolvedSvelteConfig;

declare var SvelteBrowserPlugin: import("bun").BunPlugin;
declare var SvelteServerPlugin: import("bun").BunPlugin;

declare var SvelteIsDev: boolean;
declare var SvelteHydratable: boolean;

declare module "*.svelte" {
  export const $sv_meta: import("./module").ModuleProps;

  export const $sv_module: typeof import("./module").SvelteModuleSymbol;

  const Component: import("./module").ModuleComponent;

  export default Component;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG?: string;
  }
}
