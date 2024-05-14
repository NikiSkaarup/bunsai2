import type { BunSai } from ".";
import type { BunPlugin } from "bun";
import { createHolder, type Holder } from "./util";
import { ModuleSymbol as $ms } from "./module";

// to avoid type errors
const $global: any = typeof global != "undefined" ? global : {};

export const CurrentBunSai: Holder<BunSai> =
  ($global.$$$bunsai_current_bunsai ||= createHolder());

export const IsDev: Holder<boolean> = ($global.$$$bunsai_is_dev ||=
  createHolder(typeof Bun != "undefined" && Bun.env.NODE_ENV != "production"));

export const BrowserBuildPlugins: BunPlugin[] =
  ($global.$$$bunsai_browser_build_plugins ||= []);

export const ServerBuildPlugins: BunPlugin[] =
  ($global.$$$bunsai_server_build_plugins ||= []);

export const ModuleSymbol: typeof $ms = ($global.$$$bunsai_module_symbol ||=
  $ms);
