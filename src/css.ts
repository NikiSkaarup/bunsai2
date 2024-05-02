import { createPath } from "./build";
import type { ModuleProps } from "./module";

export interface CSSData {
  meta: ModuleProps;
  sveltePrefix: string;
}

export function genCSS(data: CSSData) {
  if (!data.meta.css) return "";

  const path = createPath({
    sveltePrefix: data.sveltePrefix,
    artifactPath: getCSSArtifactPath(data.meta),
  });

  return `<link rel="stylesheet" href="${path}">`;
}

export function getCSSArtifactPath(meta: ModuleProps) {
  return `./${meta.cssHash}.css`;
}
