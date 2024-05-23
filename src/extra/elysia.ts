import Elysia, { type Context as ElysiaContext } from "elysia";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";
import type { Renderer } from "../core/create-renderer";
import type { Module } from "../core/module";

export interface BunSaiElysia {
  /**
   * Helper function to create a new instance of Elysia and automatically apply BunSai's result.
   */
  elysia(): Elysia<
    "",
    false,
    { decorator: { render: Renderer }; derive: {}; resolve: {}; store: {} }
  >;

  /**
   * Apply BunSai's result on an Elysia instance.
   */
  apply<E extends Elysia>(
    byte: E
  ): Elysia<
    E["_types"]["Prefix"],
    E["_types"]["Scoped"],
    {
      decorator: Omit<E["_types"]["Singleton"]["decorator"], "render"> & {
        render: Renderer;
      };
      derive: E["_types"]["Singleton"]["derive"];
      resolve: E["_types"]["Singleton"]["resolve"];
      store: E["_types"]["Singleton"]["store"];
    },
    E["_types"]["Definitions"],
    E["_types"]["Metadata"],
    E["_routes"],
    E["_ephemeral"],
    E["_volatile"]
  >;

  /**
   * For a given Module, creates an Elysia method handler.
   */
  handler(module: Module): (context: ElysiaContext) => Response;

  /**
   * Dynamically render a module.
   */
  render(module: Module, context: ElysiaContext): Response;
}

export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const retorno: BunSaiElysia = {
    apply(elysia) {
      result.declarations.forEach((decl) => elysia.get(decl.path, decl.handle));
      return elysia.decorate("render", result.render) as any;
    },

    elysia() {
      return retorno.apply(
        new Elysia({
          name: "bunsai2 elysia plugin",
          seed: result,
        })
      );
    },

    handler(module) {
      return (context) => result.render(module, context);
    },

    render: result.render,
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

export { Elysia };
export { default as bunsai } from "../core";
