import type { BunSai } from ".";
import type { BunPlugin } from "bun";
import { createHolder } from "./util";

export const CurrentBunSai = createHolder<BunSai | null>(),
  IsDev = createHolder<boolean>(Bun.env.NODE_ENV != "production"),
  BrowserBuildPlugins = [] as BunPlugin[],
  ServerBuildPlugins = [] as BunPlugin[];

export { ModuleSymbol } from "./module";
