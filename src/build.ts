// import { mkdir } from "fs/promises"; unused
// import { existsSync } from "fs"; unused
import { getCSSArtifactPath } from "./css";
import { registry } from "./register";

export interface BuildResult {
  path: string;
  object: Blob;
}

export type BuildManifest = Map<string, BuildResult>;

// const buildFolder = ".elysia-plugin-svelte"; unused

export async function buildClient(sveltePrefix: string) {
  if (Bun.env.DEBUG) console.log("[svelte]: creating client build...");

  // if (!existsSync(buildFolder)) await mkdir(buildFolder); unused

  const svelteFiles = Array.from(registry.keys());

  if (svelteFiles.length == 0) {
    if (Bun.env.DEBUG) console.log("[svelte]: empty registry. Skiping build");
    return;
  }

  if (Bun.env.DEBUG) console.time("[svelte]: client build time");

  const { logs, outputs, success } = await Bun.build({
    entrypoints: svelteFiles,
    minify: !SvelteIsDev,
    splitting: true,
    plugins: [SvelteBrowserPlugin],
    target: "browser",
  });

  if (!success) {
    if (Bun.env.DEBUG) console.timeEnd("[svelte]: client build time");

    throw new AggregateError(["[svelte]: found errors during build", ...logs]);
  }

  if (Bun.env.DEBUG) console.timeEnd("[svelte]: client build time");

  const entriesTup = outputs
    .filter((o) => o.kind == "entry-point")
    .map(
      (object, i) =>
        [
          svelteFiles[i],
          {
            path: createPath({
              sveltePrefix,
              artifactPath: object.path,
            }),
            object,
          },
        ] as const
    );

  const extra = Array.from(registry.values())
    .filter(({ $m_meta: $sv_meta }) => $sv_meta.css)
    .map(({ $m_meta: $sv_meta }) => ({
      object: new Blob([$sv_meta.css!], {
        type: "text/css;charset=utf-8",
      }),
      path: createPath({
        sveltePrefix,
        artifactPath: getCSSArtifactPath($sv_meta),
      }),
    }));

  return {
    entries: new Map(entriesTup) as BuildManifest,
    extra: extra.concat(
      outputs
        .filter((o) => o.kind != "entry-point")
        .map((object) => ({
          path: createPath({ sveltePrefix, artifactPath: object.path }),
          object,
        }))
    ) as BuildResult[],
  };
}

export function createPath({
  sveltePrefix,
  artifactPath,
}: {
  sveltePrefix: string;
  artifactPath: string;
}) {
  return (sveltePrefix + artifactPath.replace(/^\./, ""))
    .replaceAll("\\", "/")
    .replaceAll(/\/{2,}/g, "/");
}
