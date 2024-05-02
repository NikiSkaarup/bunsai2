import type { BunSai } from "../core";

export function createManifest(result: BunSai) {
  const manifest = new Map<string, () => Response>();

  for (const decl of result.declarations) {
    manifest.set(decl.path, decl.handle);
  }

  return {
    manifest,
    render: result.render,
  };
}

export { default as bunsai } from "../core";
