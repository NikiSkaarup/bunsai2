import { ModuleSymbol } from "./module";

global.ModuleSymbol = ModuleSymbol;
global.BrowserBuildPlugins = [];
global.ServerBuildPlugins = [];
global.IsDev = Bun.env.NODE_ENV != "production";
global.CurrentBunSai = null;
