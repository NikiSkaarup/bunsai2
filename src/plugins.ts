import type { BunPlugin } from "bun";
import * as svelte from "svelte/compiler";
import type { ResolvedSvelteConfig } from "./svelte";

export default function createPlugins(svelteConfig: ResolvedSvelteConfig) {
  const { extensions, preprocess, compilerOptions } = svelteConfig;

  const rxExtensions = extensions
    .map((etx) => etx.replaceAll(".", "\\."))
    .join("|");

  const filter = new RegExp(`(${rxExtensions})$`);

  const dev = SvelteIsDev;
  const hydratable = SvelteHydratable;

  return {
    bun: {
      name: "Svelte Bun Plugin",
      target: "bun",
      setup(build) {
        build.onLoad({ filter }, async (args) => {
          const { code } = await svelte.preprocess(
            await Bun.file(args.path).text(),
            preprocess
          );

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
            name: "$$$sv_comp",
          });

          warnings.forEach((w) => console.warn(w));

          return {
            contents:
              'import { register as $$$sv_reg } from "elysia-plugin-svelte/register";\n' +
              js +
              `\nconst _css = ${JSON.stringify(css)}, path = ${JSON.stringify(
                args.path
              )};` +
              `\nexport const $m_meta = {` +
              (dev ? `jsMap: ${JSON.stringify(jsMap)},` : "jsMap: void 0,") +
              "css: _css," +
              "cssHash: _css && Bun.hash(path + _css, 1).toString(36)," +
              (dev ? `cssMap: ${JSON.stringify(cssMap)},` : "cssMap: void 0,") +
              "path," +
              "};" +
              "\nexport const $m_symbol = SvelteModuleSymbol" +
              "export const $m_render = $$$sv_comp.render" +
              "\n$$$sv_reg({$m_meta,$m_render:$$$sv_comp.render,$m_symbol})",
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

          const {
            js: { code: contents },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            hydratable,
            dev,
            filename: args.path,
            css: "external",
            generate: "dom",
            name: "$$$sv_comp",
          });

          warnings.forEach((w) => console.warn(w));

          return {
            contents,
            loader: "js",
          };
        });
      },
    },
  } satisfies { bun: BunPlugin; browser: BunPlugin };
}
