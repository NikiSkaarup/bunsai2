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
              `\nconst _rr = ${name}.render` +
              `\n${name}.render=(...args)=>{const r =_rr(...args);$m_meta.css = r.css.code||$m_meta.css;return r}` +
              `\nconst _css = ${JSON.stringify(css)}, path = ${JSON.stringify(
                args.path
              )};` +
              `\nconst $m_meta = {` +
              (dev ? `jsMap: ${JSON.stringify(jsMap)},` : "jsMap: null") +
              "css: _css," +
              "cssHash: Bun.hash(path + _css, 1).toString(36)," +
              (dev ? `cssMap: ${JSON.stringify(cssMap)},` : "cssMap: null") +
              "path," +
              "};" +
              "\nconst $m_symbol = ModuleSymbol;" +
              `\nconst $m_render = ${name}.render;` +
              "\nconst $m_gen_script = $sv_gen_script;" +
              "\nconst render = $sv_reg({$m_meta,$m_render,$m_symbol,$m_gen_script});" +
              `\nObject.assign(${name},{$m_meta,$m_render,$m_symbol,$m_gen_script,render})` +
              (dev
                ? "\nconst __debug={$m_meta,$m_render,$m_symbol,$m_gen_script};"
                : ""),
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
