import type { BunPlugin } from "bun";
import * as svelte from "svelte/compiler";
import type { ResolvedSvelteConfig } from "./config";
import { Util } from "../../core/util";
import { IsDev } from "../../core/globals";
import { SvelteHydratable } from "./globals";

export default function createPlugins(svelteConfig: ResolvedSvelteConfig) {
  const {
    extensions,
    preprocess,
    compilerOptions,
    bunsai2: { useAsset },
  } = svelteConfig;

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

          Util.log.verbose(preprocess, code);

          const {
            css: { code: css, map: cssMap },
            js: { code: js, map: jsMap },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            hydratable,
            dev: IsDev(),
            filename: args.path,
            generate: "ssr",
            css: "external",
            name: "$sv_comp",
          });

          warnings.forEach((w) => Util.log.loud("[svelte]:", w));

          return {
            contents:
              'import { register as $sv_reg } from "bunsai/register";\n' +
              'import { ModuleSymbol } from "bunsai/globals";\n' +
              'import { genScript as $sv_gen_script } from "bunsai/svelte/script.ts";\n' +
              (useAsset == false
                ? ""
                : 'import $create_asset_getter  from "bunsai/asset";\n' +
                  "const asset = $create_asset_getter(import.meta);\n") +
              js +
              `\nconst _css = ${JSON.stringify(css)}, path = ${JSON.stringify(
                args.path
              )};` +
              `\nconst $m_meta = {` +
              (IsDev()
                ? `jsMap: ${JSON.stringify(jsMap)},`
                : "jsMap: void 0,") +
              "css: _css," +
              "cssHash: _css && Bun.hash(path + _css, 1).toString(36)," +
              (IsDev()
                ? `cssMap: ${JSON.stringify(cssMap)},`
                : "cssMap: void 0,") +
              "path," +
              "};" +
              "\nconst $m_symbol = ModuleSymbol;" +
              "\nconst $m_render = $sv_comp.render;" +
              "\nconst $m_gen_script = $sv_gen_script;" +
              "\nconst render = $sv_reg({$m_meta,$m_render,$m_symbol,$m_gen_script});" +
              "\nObject.assign($sv_comp,{$m_meta,$m_render,$m_symbol,$m_gen_script,render})",
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
            preprocess
          );

          Util.log.verbose(code);

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
            name: "$sv_comp",
          });

          warnings.forEach((w) =>
            Util.log.loud("[svelte]:", w.filename, w.message)
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
