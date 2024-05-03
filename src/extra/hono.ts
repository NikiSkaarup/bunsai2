import { Hono, type Context as HonoContext } from "hono";
import type { BunSai } from "../core";
import type { Module } from "../core/module";

export interface BunSaiHono {
  /**
   * Helper function to create a new instance of Hono and automatically apply BunSai's result.
   */
  hono(...args: ConstructorParameters<typeof Hono>): Hono;

  /**
   * Apply BunSai's result on an Hono instance.
   */
  apply<H extends Hono>(hono: H): H;

  /**
   * For a given Module, crates an Hono method handler.
   */
  handler(module: Module): (context: HonoContext) => Response;
}

export function create(result: BunSai) {
  const retorno: BunSaiHono = {
    hono(...args) {
      return retorno.apply(new Hono(...args));
    },

    apply(hono) {
      result.declarations.forEach((decl) => hono.get(decl.path, decl.handle));
      return hono;
    },

    handler(module) {
      return (context: HonoContext) => result.render(module, context);
    },
  };

  return retorno;
}

export { Hono } from "hono";
export { default as bunsai } from "../core";
