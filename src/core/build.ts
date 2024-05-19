import { getCSSArtifactPath } from "./css";
import { BrowserBuildPlugins, IsDev } from "./globals";
import { registry } from "./register";
import { log, time } from "./util";
import { getSource } from "./source";
import { mkdtempSync } from "fs";
import { join, relative } from "path";
import { tmpdir } from "os";
import type { BuildArtifact } from "bun";

export interface BuildResult {
  path: string;
  object: BuildArtifact | Blob;
}

export type BuildManifest = Map<string, BuildResult>;

export interface ClientBuild {
  entries: BuildManifest;
  extra: BuildResult[];
}

export const dumpFolder = mkdtempSync(join(tmpdir(), "bunsai-temp-"));

export async function buildClient(
  prefix: string,
  root: string
): Promise<ClientBuild | undefined> {
  log.debug("creating client build...");

  const files = Array.from(registry.keys());

  if (files.length == 0) {
    log.debug("empty registry. Skiping build");
    return;
  }

  const cbt = time.debug("client build time");

  const { logs, outputs, success } = await Bun.build({
    root,
    entrypoints: files,
    minify: !IsDev(),
    splitting: true,
    plugins: BrowserBuildPlugins,
    target: "browser",
    naming: {
      asset: "[dir]/[name].[ext]",
    },
    sourcemap: "external",
    outdir: dumpFolder,
  });

  cbt();

  if (!success) {
    throw new AggregateError(["found errors during build", ...logs]);
  }

  const entriesTup = await outputs
    .filter((o) => o.kind == "entry-point")
    .mapAsync(async (object) => {
      const source = await getSource(object);

      if (!source) throw new Error("bunsai bug; check debug logs");

      return [
        source,
        {
          path: createPath({
            prefix,
            artifactPath: relative(dumpFolder, object.path),
          }),
          object,
        },
      ] as const;
    });

  const extra = Array.from(registry.values())
    .filter(({ $m_meta }) => $m_meta.css)
    .map(({ $m_meta }) => ({
      object: new Blob([$m_meta.css!], {
        type: "text/css;charset=utf-8",
      }),
      path: createPath({
        prefix,
        artifactPath: getCSSArtifactPath($m_meta),
      }),
    }));

  return {
    entries: new Map(entriesTup) as BuildManifest,
    extra: extra.concat(
      await outputs
        .filter((o) =>
          (IsDev()
            ? ["sourcemap", "chunk", "asset"]
            : ["chunk", "asset"]
          ).includes(o.kind)
        )
        .mapAsync(async (object) => {
          const path = createPath({
            prefix: prefix,
            artifactPath: relative(dumpFolder, object.path),
          });

          return {
            path,
            object,
          };
        })
    ) as BuildResult[],
  };
}

export function createPath({
  prefix,
  artifactPath,
}: {
  prefix: string;
  artifactPath: string;
}) {
  return ("/" + prefix + "/" + artifactPath)
    .replaceAll("\\", "/")
    .replaceAll(/\/{2,}/g, "/");
}
