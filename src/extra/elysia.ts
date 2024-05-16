import Elysia from "elysia";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

/**
 * @returns An Elysia plugin to resolve the assets and browser modules + the 'render' decorator
 */
export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const plugin = new Elysia({
    name: "bunsai2 elysia plugin",
    seed: result,
  }).decorate("render", result.render);

  result.declarations.forEach((decl) => plugin.get(decl.path, decl.handle));

  return plugin;
}

/**
 * Automatically call `bunsai/with-config`,
 * then call {@link plug}
 */
export async function plugged() {
  const { default: b } = await import("../core/with-config");

  return plug(b);
}

export { Elysia };
export { default as bunsai } from "../core";
