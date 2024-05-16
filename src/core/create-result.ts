import type { Attributes } from "./attrs";
import { type ClientBuild } from "./build";
import { createRenderer } from "./create-renderer";
import type { BunSai } from ".";

export function createResult(
  build: ClientBuild,
  prefix: string,
  root: string,
  defaultAttrs?: Attributes
) {
  const manifest = build.extra.concat(Array.from(build.entries.values()));

  const retorno: BunSai = {
    prefix,
    root,
    render: createRenderer(build, prefix, defaultAttrs),
    declarations: [],
  };

  for (const { object, path } of manifest) {
    retorno.declarations.push({
      path,
      handle: () =>
        new Response(object, { headers: { "content-type": object.type } }),
    });
  }
  return retorno;
}
