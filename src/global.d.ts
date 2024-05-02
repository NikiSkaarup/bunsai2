declare var SvelteModuleSymbol: typeof import("./module").SvelteModuleSymbol;

declare var SvelteResolvedConfig: import("./svelte").ResolvedSvelteConfig;

declare var SvelteBrowserPlugin: import("bun").BunPlugin;
declare var SvelteServerPlugin: import("bun").BunPlugin;

declare var SvelteIsDev: boolean;
declare var SvelteHydratable: boolean;

declare module "*.svelte" {
  export const $m_meta: import("./module").ModuleProps;

  export const $m_module: typeof import("./module").SvelteModuleSymbol;

  export const $m_render: import("./module").ModuleRenderer;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG?: string;
  }
}
