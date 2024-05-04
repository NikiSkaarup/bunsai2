import Elysia from "elysia";
import type { BunSai } from "../core";

export function plug(result: BunSai) {
  const plugin = new Elysia({
    name: "bunsai2 elysia plugin",
    seed: result,
  });

  result.declarations.forEach((decl) => plugin.get(decl.path, decl.handle));

  return plugin;
}

export { default as Elysia } from "elysia";
export { default as bunsai } from "../core";
