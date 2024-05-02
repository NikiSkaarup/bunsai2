import { ModuleSymbol } from "./module";

global.ModuleSymbol = ModuleSymbol;
global.BrowserBuildPlugins = [];
global.IsDev = Bun.env.NODE_ENV != "production";
