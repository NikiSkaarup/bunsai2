/// <reference path="../../core/global.d.ts"/>
/// <reference path="../../core/global.d.ts"/>
/// <reference path="../../core/global.d.ts"/>

declare module "*.svelte" {
  type SvelteModule = import("../../core/module").StandaloneModule;

  const module: SvelteModule;

  export = module;
}

declare type SvelteConfig = import("./config").Config;

/**
 * Must **NOT** be used in `context="module"` script
 *
 * Converts Bun asset import into a BunSai compatible URL.
 *
 * NOTE: Unavailable if `SvelteConfig.bunsai2.useAsset` is set to `false`.
 *
 * @example
 * import logo from "./assets/logo.png";
 *
 * asset(logo); // /__bunsai__/assets/logo.png
 */
declare var asset: import("../asset").Asset;
