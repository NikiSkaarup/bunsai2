import type { SvelteModule } from "./module";

export const registry = new Map<string, SvelteModule>();

export function register(component: SvelteModule) {
  registry.set(component.$sv_meta.path, component);
}
