import Elysia from "elysia";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const plugin = new Elysia({
    name: "bunsai2 elysia plugin",
    seed: result,
  }).decorate("render", result.render);

  result.declarations.forEach((decl) => plugin.get(decl.path, decl.handle));

  return plugin;
}

export { default as Elysia } from "elysia";
export { default as bunsai } from "../core";
