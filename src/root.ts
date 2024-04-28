import type { ProcessedRenderAttrs } from "./attrs";

export interface RenderData extends ProcessedRenderAttrs {
  head_content: string;
  body_content: string;
}

export function render(rootHTML: string, data: RenderData) {
  return rootHTML
    .replace("%svelte.html.lang%", data.html_lang)
    .replace("%svelte.fav_url%", data.fav_url)
    .replace("%svelte.head%", data.head_content)
    .replace("%svelte.body.attrs%", data.body_attrs)
    .replace("%svelte.root.attrs%", data.root_attrs)
    .replace("%svelte.body%", data.body_content);
}
