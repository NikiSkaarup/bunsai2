import type {
  CssHashGetter,
  EnableSourcemap,
  PreprocessorGroup,
} from "svelte/compiler";
import { Util } from "../../core/util";

export interface CompileOptions {
  /**
   * If `"throw"`, Svelte throws when a compilation error occurred.
   * If `"warn"`, Svelte will treat errors as warnings and add them to the warning report.
   *
   * @default 'throw'
   */
  errorMode?: "throw" | "warn";

  /**
   * If `"strict"`, Svelte returns a variables report with only variables that are not globals nor internals.
   * If `"full"`, Svelte returns a variables report with all detected variables.
   * If `false`, no variables report is returned.
   *
   * @default 'strict'
   */
  varsReport?: "full" | "strict" | false;

  /**
   * An initial sourcemap that will be merged into the final output sourcemap.
   * This is usually the preprocessor sourcemap.
   *
   * @default null
   */
  sourcemap?: object | string;

  /**
   * If `true`, Svelte generate sourcemaps for components.
   * Use an object with `js` or `css` for more granular control of sourcemap generation.
   *
   * @default true
   */
  enableSourcemap?: EnableSourcemap;

  /**
   * The location of the `svelte` package.
   * Any imports from `svelte` or `svelte/[module]` will be modified accordingly.
   *
   * @default 'svelte'
   */
  sveltePath?: string;

  /**
   * If `true`, causes extra code to be added to components that will perform runtime checks and provide debugging information during development.
   *
   * @default Bun.env.NODE_ENV != "production"
   */
  dev?: boolean;

  /**
   * If `true`, getters and setters will be created for the component's props. If `false`, they will only be created for readonly exported values (i.e. those declared with `const`, `class` and `function`). If compiling with `customElement: true` this option defaults to `true`.
   *
   * @default false
   */
  accessors?: boolean;

  /**
   * If `true`, tells the compiler that you promise not to mutate any objects.
   * This allows it to be less conservative about checking whether values have changed.
   *
   * @default false
   */
  immutable?: boolean;

  /**
   * If `true` when generating DOM code, enables the `hydrate: true` runtime option, which allows a component to upgrade existing DOM rather than creating new DOM from scratch.
   * When generating SSR code, this adds markers to `<head>` elements so that hydration knows which to replace.
   *
   * @default true
   */
  hydratable?: boolean;

  /**
   * If `true`, generates code that will work in IE9 and IE10, which don't support things like `element.dataset`.
   *
   * @default false
   */
  legacy?: boolean;

  /**
   * If `true`, tells the compiler to generate a custom element constructor instead of a regular Svelte component.
   *
   * @default false
   */
  customElement?: boolean;

  /**
   * A `string` that tells Svelte what tag name to register the custom element with.
   * It must be a lowercase alphanumeric string with at least one hyphen, e.g. `"my-element"`.
   *
   * @default null
   */
  tag?: string;

  /**
   * A `number` that tells Svelte to break the loop if it blocks the thread for more than `loopGuardTimeout` ms.
   * This is useful to prevent infinite loops.
   * **Only available when `dev: true`**.
   *
   * @default 0
   */
  loopGuardTimeout?: number;

  /**
   * The namespace of the element; e.g., `"mathml"`, `"svg"`, `"foreign"`.
   *
   * @default 'html'
   */
  namespace?: string;

  /**
   * A function that takes a `{ hash, css, name, filename }` argument and returns the string that is used as a classname for scoped CSS.
   * It defaults to returning `svelte-${hash(css)}`.
   *
   * @default undefined
   */
  cssHash?: CssHashGetter;

  /**
   * If `true`, your HTML comments will be preserved during server-side rendering. By default, they are stripped out.
   *
   * @default false
   */
  preserveComments?: boolean;

  /**
   *  If `true`, whitespace inside and between elements is kept as you typed it, rather than removed or collapsed to a single space where possible.
   *
   * @default false
   */
  preserveWhitespace?: boolean;
  /**
   *  If `true`, exposes the Svelte major version in the browser by adding it to a `Set` stored in the global `window.__svelte.v`.
   *
   * @default true
   */
  discloseVersion?: boolean;
}

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
  /** Preprocessor options, if any. */
  preprocess?: PreprocessorGroup | PreprocessorGroup[];
  /**
   * Configurations for BunSai2
   */
  bunsai2?: {
    /**
     * If true, then `global.IsDev = compilerOptions.dev ?? Bun.env.NODE_ENV != "production";`
     */
    overrideIsDev?: boolean;
  };
}

export type ResolvedSvelteConfig = Required<Config>;

const configFileGlob = new Bun.Glob("./**/svelte.config{.js,.mjs,.cjs,.ts}");

export default async function getSvelteConfig() {
  for await (const file of configFileGlob.scan({ absolute: true })) {
    Util.log.debug("[svelte]: loading config from", file);

    const config = (await import(file)).default as ResolvedSvelteConfig;

    if (typeof config != "object")
      throw new Error("[svelte]: config file does not have an default export");

    config.compilerOptions ||= {};
    config.extensions ||= [".svelte"];
    config.preprocess ||= [];
    config.bunsai2 ||= {};

    return config as ResolvedSvelteConfig;
  }

  Util.log.loud(
    "[svelte]: config file was not found. Using default svelte settings."
  );

  return {
    compilerOptions: {},
    extensions: [".svelte"],
    preprocess: [],
    bunsai2: {},
  } as ResolvedSvelteConfig;
}
