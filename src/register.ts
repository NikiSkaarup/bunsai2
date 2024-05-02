import type { Module } from "./module";

export const registry = new Map<string, Module>();

export function register(component: Module) {
  registry.set(component.$m_meta.path, component);
}
