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
              'import { register as $$$sv_reg } from "elysia-plugin-svelte/src/register";\n' +
              js +
              `\nexport const $sv_meta = {` +
              (dev ? `jsMap: ${JSON.stringify(jsMap)},` : "jsMap: void 0,") +
              `css: ${JSON.stringify(css)},` +
              (dev ? `cssMap: ${JSON.stringify(cssMap)},` : "cssMap: void 0,") +
              `path: ${JSON.stringify(args.path)},` +
              "};" +
              "\nexport const $sv_module = SvelteModuleSymbol" +
              "\n$$$sv_reg({$sv_meta,default:$$$sv_comp,$sv_module})",
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
