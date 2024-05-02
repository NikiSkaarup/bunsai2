import type { BunPlugin } from "bun";

export function makePlugin<BP extends BunPlugin>({
  bun,
  browser,
}: {
  bun: BP;
  browser: BunPlugin;
}) {
  BrowserBuildPlugins.push(browser);

  return Bun.plugin(bun);
}
