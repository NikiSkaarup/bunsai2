import type { BunSai } from "../core";
import { join } from "path";

export async function writeToDisk(rootFolder: string, result: BunSai) {
  for (const decl of result.declarations) {
    const path = join(rootFolder, decl.path);

    await Bun.write(path, await decl.handle().arrayBuffer());
  }
}

export { default as bunsai } from "../core";
