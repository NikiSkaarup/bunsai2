/// <reference path="./global.d.ts" />

import { makePlugin } from "../../core/make-plugin";
import getSvelteConfig from "./config";
import createPlugins from "./plugins";

const svConfig = await getSvelteConfig();

global.SvelteResolvedConfig = svConfig;

if (svConfig.bunsai2.overrideIsDev)
  global.IsDev =
    svConfig.compilerOptions.dev ?? Bun.env.NODE_ENV != "production";

global.SvelteHydratable = svConfig.compilerOptions.hydratable ?? true;

makePlugin(createPlugins(svConfig));
