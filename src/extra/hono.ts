import { Hono, type Context } from "hono";
import type { BunSai } from "../core";
import type { Module } from "../core/module";

export function create(result: BunSai | void) {
  if (!result)
    result = {
      declarations: [],
      render(module, context) {
        return Response.error();
      },
    };

  const retorno = {
    Hono(...args: ConstructorParameters<typeof Hono>) {
      return retorno.apply(new Hono(...args));
    },

    apply<H extends Hono>(hono: H) {
      result.declarations.forEach((decl) => hono.get(decl.path, decl.handle));
      return hono;
    },

    handler(module: Module) {
      return (context: Context) => result.render(module, context);
    },
  };

  return retorno;
}

export { Hono } from "hono";
export { default as bunsai } from "../core";
