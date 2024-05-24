import type { BunPlugin } from "bun";
import * as svelte from "svelte/compiler";
import type { ResolvedSvelteConfig } from "./config";
import { log } from "../../core/util";
import { IsDev } from "../../core/globals";
import { SvelteHydratable } from "./globals";

export default function createPlugins(svelteConfig: ResolvedSvelteConfig) {
  const {
    extensions,
    preprocess,
    compilerOptions,
    bunsai2: { useAsset, ignore = [new Bun.Glob("**/node_modules/**")] },
  } = svelteConfig;

  const ignoreGlobMatches = (path: string) => ignore.some((g) => g.match(path));

  const rxExtensions = extensions
    .map((etx) => etx.replaceAll(".", "\\."))
    .join("|");

  const filter = new RegExp(`(${rxExtensions})$`);

  const hydratable = SvelteHydratable();

  return {
    bun: {
      name: "Svelte Bun Plugin",
      target: "bun",
      setup(build) {
        build.onLoad({ filter }, async (args) => {
          const { code } = await svelte.preprocess(
            await Bun.file(args.path).text(),
            preprocess,
            { filename: args.path }
          );

          const name = "$" + Bun.hash(args.path, 0).toString(36);

          const dev = IsDev();

          const {
            css: { code: css, map: cssMap },
            js: { code: js, map: jsMap },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            hydratable,
            dev,
            filename: args.path,
            generate: "ssr",
            css: "external",
            name,
          });

          warnings.forEach((w) =>
            log.verbose("[svelte]:", w.filename, w.message)
          );

          if (ignoreGlobMatches(args.path))
            return {
              contents:
                useAsset == false
                  ? js
                  : 'import $create_asset_getter  from "bunsai/asset";\n' +
                    js +
                    "const asset = $create_asset_getter(import.meta);\n",
              loader: "js",
            };

          return {
            contents:
              'import { register as $register } from "bunsai/register";\n' +
              'import { ModuleSymbol } from "bunsai/globals";\n' +
              'import { genScript as $sv_gen_script } from "bunsai/svelte/script.ts";\n' +
              'import { transformRender as $sv_transform_render } from "bunsai/svelte/transform-render.ts";\n' +
              (useAsset == false
                ? ""
                : 'import $create_asset_getter  from "bunsai/asset";\n' +
                  "const asset = $create_asset_getter(import.meta);\n") +
              js +
              `\nconst path = "${args.path}";` +
              `\nconst $m_meta = {` +
              "css: null," +
              `cssHash: "${name.slice(1)}",` +
              "path," +
              "};" +
              "\nconst $m_symbol = ModuleSymbol;" +
              `\nconst $m_render=$sv_transform_render(${name}.render);` +
              "\nconst $m_gen_script = $sv_gen_script;" +
              "\nconst render = $register({$m_meta,$m_render,$m_symbol,$m_gen_script});" +
              `\nObject.assign(${name},{$m_meta,$m_render,$m_symbol,$m_gen_script,render})`,
            loader: "js",
          };
        });
      },
    },
    browser: {
      name: "Svelte Browser Plugin",
      target: "browser",
      setup(build) {
        build.onLoad({ filter }, async (args) => {
          const { code } = await svelte.preprocess(
            await Bun.file(args.path).text(),
            preprocess,
            {
              filename: args.path,
            }
          );

          const name = "$" + Bun.hash(args.path, 0).toString(36);

          const {
            js: { code: js },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            hydratable,
            dev: IsDev(),
            filename: args.path,
            css: "external",
            generate: "dom",
            name,
          });

          warnings.forEach((w) =>
            log.verbose("[svelte]:", w.filename, w.message)
          );

          return {
            contents:
              useAsset == false
                ? js
                : 'import $create_asset_getter from "bunsai/asset";\n' +
                  js +
                  "\nconst asset = $create_asset_getter(import.meta);",
            loader: "js",
          };
        });
      },
    },
  } satisfies { bun: BunPlugin; browser: BunPlugin };
}
