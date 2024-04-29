import type { ProcessedRenderAttrs } from "./attrs";

export interface RenderData extends ProcessedRenderAttrs {
  head_content: string;
  body_content: string;
  script_content: string;
}

export function render(rootHTML: string, data: RenderData) {
  return new Response(
    rootHTML
      .replace("%svelte.html.lang%", data.html_lang)
      .replace("%svelte.head%", data.head_content)
      .replace("%svelte.body.attrs%", data.body_attrs)
      .replace("%svelte.root.attrs%", data.root_attrs)
      .replace("%svelte.body%", data.body_content)
      .replace("%svelte.script%", data.script_content),
    { headers: { "content-type": "text/html;charset=utf-8" } }
  );
}
