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

/**
 * Must **NOT** be used in `context="module"` script
 *
 * Converts Bun asset import into a BunSai compatible URL.
 *
 * @example
 * import logo from "./assets/logo.png";
 *
 * asset(logo); // /__bunsai__/assets/logo.png
 */
declare var asset: import("../asset").Asset;
