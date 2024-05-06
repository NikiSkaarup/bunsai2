declare module "*.svelte" {
  const mod: import("../../core/module").Module;

  export = mod;
}

declare type SvelteConfig = import("./config").Config;
