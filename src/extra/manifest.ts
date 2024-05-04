import type { BunSai } from "../core";

export function createManifest(result: BunSai) {
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
