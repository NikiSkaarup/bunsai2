import createPlugins from "./plugins";
import getSvelteConfig from "./svelte";
import { SvelteModuleSymbol } from "./module";

global.SvelteModuleSymbol = SvelteModuleSymbol;

const svConfig = await getSvelteConfig();

global.SvelteResolvedConfig = svConfig;
global.SvelteIsDev =
  svConfig.compilerOptions.dev ?? Bun.env.NODE_ENV != "production";
global.SvelteHydratable = svConfig.compilerOptions.hydratable ?? true;

const { browser, bun } = createPlugins(svConfig);

Bun.plugin(bun);

global.SvelteBrowserPlugin = browser;
global.SvelteServerPlugin = bun;
