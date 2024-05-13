import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

export function plug(result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  const assets = new Map<string, () => Response>();

  for (const decl of result.declarations) {
    assets.set(decl.path, decl.handle);
  }

  return {
    assets,
    render: result.render,
  };
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
export const createManifest = plug;

export { default as bunsai } from "../core";
