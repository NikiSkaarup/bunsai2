import Elysia from "elysia";
import type { BunSai } from "../core";
import type { Module } from "../core/module";

export function toElysia(result: BunSai | void) {
  const plugin = new Elysia({
    name: "bunsai2 elysia plugin",
    seed: result,
  });

  if (!result) return plugin;

  result.declarations.forEach((decl) => plugin.get(decl.path, decl.handle));

  plugin.onAfterHandle({ as: "global" }, ({ response, ...context }) => {
    if ((<Module>response)?.$m_symbol !== ModuleSymbol) return;

    return result.render(<Module>response, context);
  });

  return plugin;
}

export { default as Elysia } from "elysia";
export { default as bunsai } from "../core";
