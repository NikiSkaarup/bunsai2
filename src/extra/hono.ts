import { Hono, type Env, type Context as HonoContext, type Schema } from "hono";
import type { Module } from "../core/module";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";
import type { BlankSchema } from "hono/types";

export interface BunSaiHono {
  /**
   * Helper function to create a new instance of Hono and automatically apply BunSai's result.
   */
  hono<
    E extends Env = Env,
    S extends Schema = BlankSchema,
    BasePath extends string = "/"
  >(
    ...args: ConstructorParameters<typeof Hono<E, S, BasePath>>
  ): Hono<E, S, BasePath>;

  /**
   * Apply BunSai's result on an Hono instance.
   */
  apply<H extends Hono>(hono: H): H;

  /**
   * For a given Module, creates an Hono method handler.
   */
  handler(module: Module): (context: HonoContext) => Response;
}

export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const retorno: BunSaiHono = {
    hono: function <
      E extends Env = Env,
      S extends Schema = BlankSchema,
      BasePath extends string = "/"
    >(
      ...args: ConstructorParameters<typeof Hono<E, S, BasePath>>
    ): Hono<E, S, BasePath> {
      // @ts-ignore
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

/**
 * Automatically call `bunsai/with-config`,
 * then call {@link plug}
 */
export async function plugged() {
  const { default: b } = await import("../core/with-config");

  return plug(b);
}

/**
 * @deprecated Use {@link plug} instead
 */
export const create = plug;

export { Hono } from "hono";
export { default as bunsai } from "../core";
