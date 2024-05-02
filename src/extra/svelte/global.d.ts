declare var SvelteResolvedConfig: import("./config").ResolvedSvelteConfig;

declare var SvelteHydratable: boolean;

declare module "*.svelte" {
  const mod: import("../../core/module").Module;

  export = mod;
}

declare type SvelteConfig = import("./config").Config;
