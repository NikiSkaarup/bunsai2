import { Byte, type BaseContext as ByteContext } from "@bit-js/byte";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";
import type { Module } from "../core/module";

export interface BunSaiByte {
  /**
   * Helper function to create a new instance of Byte and automatically apply BunSai's result.
   */
  byte(): Byte;

  /**
   * Apply BunSai's result on an Byte instance.
   */
  apply<B extends Byte>(byte: B): B;

  /**
   * For a given Module, creates an Hono method handler.
   */
  handler(module: Module): (context: ByteContext) => Response;

  /**
   * Dynamically render a module.
   */
  render(module: Module, context: ByteContext): Response;
}

export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const retorno: BunSaiByte = {
    apply(byte) {
      result.declarations.forEach((decl) => byte.get(decl.path, decl.handle));
      return byte;
    },

    byte() {
      return retorno.apply(new Byte());
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

export { Byte };
export { default as bunsai } from "../core";
