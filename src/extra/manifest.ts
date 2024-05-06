import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

export function createManifest(result = CurrentBunSai()) {
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

export { default as bunsai } from "../core";
