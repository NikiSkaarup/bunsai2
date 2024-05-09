import type { Module } from "./module";
import { CurrentBunSai } from "./globals";

export type StandaloneRenderer<Context extends Record<string, any>> = (
  context: Context
) => Response;

export const registry = new Map<string, Module<any>>();

class StandaloneRendererError extends Error {
  name = "StandaloneRendererError";
}

/**
 * Register a component so it can be used later by the main function.
 */
export function register<
  Context extends Record<string, any> = Record<string, any>
>(component: Module<Context>): StandaloneRenderer<Context> {
  registry.set(component.$m_meta.path, component);

  return (context) => {
    const bunsai = CurrentBunSai();
    if (!bunsai)
      throw new StandaloneRendererError("cannot render before bunsai()");

    return bunsai.render(component, context);
  };
}
