import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { registry } from "./register";
import type { BuildArtifact } from "bun";

export interface BuildResult {
  path: string;
  object: BuildArtifact;
}

export type BuildManifest = Map<string, BuildResult>;

const buildFolder = ".elysia-plugin-svelte";

export async function buildClient(sveltePrefix: string) {
  console.log("[svelte]: creating client build...");

  if (!existsSync(buildFolder)) await mkdir(buildFolder);

  const svelteFiles = await Array.fromAsync(Array.from(registry.keys()));

  if (svelteFiles.length == 0) {
    console.warn("[svelte]: empty registry! Skiping build");
    return;
  }

  console.time("[svelte]: client build time");

  const { logs, outputs, success } = await Bun.build({
    entrypoints: svelteFiles,
    minify: !SvelteIsDev,
    splitting: true,
    plugins: [SvelteBrowserPlugin],
    target: "browser",
  });

  if (!success) {
    console.timeEnd("[svelte]: client build time");

    throw new AggregateError(["[svelte]: found errors during build", ...logs]);
  }

  console.timeEnd("[svelte]: client build time");

  return {
    entries: new Map(
      outputs
        .filter((o) => o.kind == "entry-point")
        .map(
          (object, i) =>
            [
              svelteFiles[i],
              {
                path: createPath(object),
                object,
              },
            ] as const
        )
    ) as BuildManifest,
    extra: outputs
      .filter((o) => o.kind != "entry-point")
      .map((object) => ({
        path: createPath(object),
        object,
      })) as BuildResult[],
  };

  function createPath(object: BuildArtifact): string {
    return (sveltePrefix + object.path.replace(/^\./, ""))
      .replaceAll("\\", "/")
      .replaceAll(/\/{2,}/g, "/");
  }
}
