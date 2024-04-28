import type { BunPlugin } from "bun";
import * as svelte from "svelte/compiler";
import type { ResolvedSvelteConfig } from "./svelte";

export default function createPlugins(
  svelteConfig: ResolvedSvelteConfig,
  forceDev: boolean
) {
  const { extensions, preprocess, compilerOptions } = svelteConfig;

  const rxExtensions = extensions
    .map((etx) => etx.replaceAll(".", "\\."))
    .join("|");

  const filter = new RegExp(`(${rxExtensions})$`);

  return {
    bun: {
      name: "Svelte Bun Plugin",
      target: "bun",
      setup(build) {
        build.onLoad({ filter }, async (args) => {
          const { code, dependencies } = await svelte.preprocess(
            await Bun.file(args.path).text(),
            preprocess
          );

          console.log(dependencies);

          const {
            css: { code: css, map: cssMap },
            js: { code: js, map: jsMap },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            dev: forceDev ? true : compilerOptions.dev,
            filename: args.path,
            generate: "ssr",
          });

          warnings.forEach((w) => console.warn(w));

          return {
            contents:
              js +
              `\nexport const $sv_jsMap = ${JSON.stringify(jsMap)};` +
              `\nexport const $sv_css = ${JSON.stringify(css)};` +
              `\nexport const $sv_cssMap = ${JSON.stringify(cssMap)}` +
              `\nexport const $sv_path = ${JSON.stringify(args.path)}`,
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
          const { code, dependencies } = await svelte.preprocess(
            await Bun.file(args.path).text(),
            preprocess
          );

          console.log(dependencies);

          const {
            css: { code: css, map: cssMap },
            js: { code: js, map: jsMap },
            warnings,
          } = svelte.compile(code, {
            ...compilerOptions,
            dev: forceDev ? true : compilerOptions.dev,
            filename: args.path,
            generate: "dom",
          });

          warnings.forEach((w) => console.warn(w));

          return {
            contents:
              js +
              `\nexport const $sv_jsMap = ${JSON.stringify(jsMap)};` +
              `\nexport const $sv_css = ${JSON.stringify(css)};` +
              `\nexport const $sv_cssMap = ${JSON.stringify(cssMap)}` +
              `\nexport const $sv_path = ${JSON.stringify(args.path)}`,
            loader: "js",
          };
        });
      },
    },
  } satisfies { bun: BunPlugin; browser: BunPlugin };
}
