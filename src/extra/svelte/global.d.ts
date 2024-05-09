declare module "*.svelte" {
  type SvelteModule = import("../../core/module").Module & {
    render: import("../../core/register").StandaloneRenderer<
      Record<string, any>
    >;
  };

  const module: SvelteModule;

  export = module;
}

declare type SvelteConfig = import("./config").Config;
