import type { BuildArtifact } from "bun";
import { isAbsolute, resolve } from "path";
import { dumpFolder } from "./build";
import { log } from "./util";

export async function getSource(artifact: BuildArtifact) {
  if (!artifact.sourcemap) {
    log.debug("no sourcemap for:", artifact.path);
    return null;
  }

  const { sources } = (await artifact.sourcemap.json()) as {
    sources: string[];
  };

  const src = sources.pop();

  if (!src) {
    log.debug("no source in sourcemap for:", artifact.path);
    return null;
  }

  if (isAbsolute(src)) return src;

  return resolve(dumpFolder, src);
}
