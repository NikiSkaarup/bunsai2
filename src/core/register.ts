import type { Module } from "./module";

export type StandaloneRenderer = (context: Record<string, any>) => Response;

export const registry = new Map<string, Module>();

class StandaloneRendererError extends Error {
  name = "StandaloneRendererError";
}

/**
 * Register a component so it can be used later by the main function.
 */
export function register(component: Module): StandaloneRenderer {
  registry.set(component.$m_meta.path, component);

  return (context) => {
    if (!CurrentBunSai)
      throw new StandaloneRendererError("cannot render before bunsai()");

    return CurrentBunSai.render(component, context);
  };
}
