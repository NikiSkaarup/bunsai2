import type { BunSai } from "../core";
import { join } from "path";

export async function writeToDisk(rootFolder: string, result: BunSai | void) {
  if (!result) return;

  const paths: string[] = [];

  for (const decl of result.declarations) {
    const path = join(rootFolder, decl.path);

    paths.push(path);

    await Bun.write(path, await decl.handle().arrayBuffer());
  }

  return { paths, render: result.render };
}

export { default as bunsai } from "../core";
