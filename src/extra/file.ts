import { join } from "path";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

export async function writeToDisk(
  rootFolder: string,
  result = CurrentBunSai()
) {
  if (!result) throw new BunSaiLoadError();

  for (const decl of result.declarations) {
    const path = join(rootFolder, decl.path);

    await Bun.write(path, await decl.handle().arrayBuffer());
  }
}

export { default as bunsai } from "../core";
