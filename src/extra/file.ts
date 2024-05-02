import type { BunSai } from "../core";
import { join } from "path";

export async function writeToDisk(rootFolder: string, result: BunSai | void) {
  if (!result) return;

  const paths: { web: string; disk: string }[] = [];

  for (const decl of result.declarations) {
    const path = join(rootFolder, decl.path);

    paths.push({ web: decl.path, disk: path });

    await Bun.write(path, await decl.handle().arrayBuffer());
  }

  return { paths, render: result.render };
}

export { default as bunsai } from "../core";
