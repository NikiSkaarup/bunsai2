import type { Module } from "./module";

export const registry = new Map<string, Module>();

/**
 * Register a component so it can be used later by the main function.
 */
export function register(component: Module) {
  registry.set(component.$m_meta.path, component);
}
