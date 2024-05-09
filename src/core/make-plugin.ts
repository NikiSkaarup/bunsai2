import type { BunPlugin } from "bun";
import { BrowserBuildPlugins, ServerBuildPlugins } from "./globals";

/**
 * Helper function to register a plugin.
 *
 * `browser` will be pushed to the `BrowserBuildPlugins` array.
 *
 * `bun` will be evaluated using `Bun.plugin(bun)`.
 *
 * This function passes on the returned value from `Bun.plugin(bun)`.
 */
export function makePlugin<BP extends BunPlugin>({
  bun,
  browser,
}: {
  bun: BP;
  browser?: BunPlugin;
}) {
  if (browser) BrowserBuildPlugins.push(browser);
  ServerBuildPlugins.push(bun);
  return Bun.plugin(bun);
}
