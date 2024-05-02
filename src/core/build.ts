// import { mkdir } from "fs/promises"; unused
// import { existsSync } from "fs"; unused
import { getCSSArtifactPath } from "./css";
import { registry } from "./register";
import { Util } from "./util";

export interface BuildResult {
  path: string;
  object: Blob;
}

export type BuildManifest = Map<string, BuildResult>;

// const buildFolder = ".elysia-plugin-svelte"; unused

export async function buildClient(sveltePrefix: string) {
  Util.log.debug("creating client build...");

  // if (!existsSync(buildFolder)) await mkdir(buildFolder); unused

  const svelteFiles = Array.from(registry.keys());

  if (svelteFiles.length == 0) {
    Util.log.debug("empty registry. Skiping build");
    return;
  }

  const cbt = Util.time.debug("client build time");

  const { logs, outputs, success } = await Bun.build({
    entrypoints: svelteFiles,
    minify: !IsDev,
    splitting: true,
    plugins: BrowserBuildPlugins,
    target: "browser",
  });

  if (!success) {
    cbt();

    throw new AggregateError(["found errors during build", ...logs]);
  }

  cbt();

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
