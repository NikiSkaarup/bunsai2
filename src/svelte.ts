import type { CompileOptions, PreprocessorGroup } from "svelte/compiler";

export interface Config {
  /**
   * Options passed to [`svelte.compile`](https://svelte.dev/docs#compile-time-svelte-compile).
   * @default {}
   */
  compilerOptions?: CompileOptions;
  /**
   * List of file extensions that should be treated as Svelte files.
   * @default [".svelte"]
   */
  extensions?: string[];
  /** Preprocessor options, if any. Preprocessing can alternatively also be done through Vite's preprocessor capabilities. */
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
}

export type ResolvedSvelteConfig = Required<Config>;

const configFile = new Bun.Glob("./**/svelte.config{.js,.mjs,.cjs,.ts}").scan({
  absolute: true,
});

export default async function getSvelteConfig() {
  for await (const file of configFile) {
    console.log("[svelte]: loading config from", file);

    const config = (await import(file)).default;

    if (typeof config != "object")
      throw new Error("Svelte config file does not have an default export");

    config.compilerOptions ||= {};
    config.extensions ||= [".svelte"];
    config.preprocess ||= [];

    return config as ResolvedSvelteConfig;
  }

  console.log(
    "Svelte config file was not found. Using default svelte settings."
  );

  return {
    compilerOptions: {},
    extensions: [".svelte"],
    preprocess: [],
  } as ResolvedSvelteConfig;
}
