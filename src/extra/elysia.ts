import Elysia from "elysia";
import type { BunSai } from "../core";
import type { Module } from "../core/module";

export function toPlugin(result: BunSai | void) {
  if (!result) throw new Error("cannot handle void result");

  const plugin = new Elysia({
    name: "bunsai2 elysia plugin",
    seed: result,
  });

  result.declarations.forEach((decl) => plugin.get(decl.path, decl.handler));

  plugin.onAfterHandle({ as: "global" }, ({ response, ...context }) => {
    if ((<Module>response)?.$m_symbol !== ModuleSymbol) return;

    return result.render(<Module>response, context);
  });

  return plugin;
}

export { default as Elysia } from "elysia";
export { default as bunsai } from "../core";
