import type { ProcessedRenderAttrs } from "./attrs";
import rootHTML from "./root.html";

export interface RenderData extends ProcessedRenderAttrs {
  head_content: string;
  body_content: string;
  script_content: string;
}

export function render(data: RenderData) {
  return new Response(
    rootHTML
      .replace("%lang%", data.html_lang)
      .replace("%head%", data.head_content)
      .replace("%body.attrs%", data.body_attrs)
      .replace("%root.attrs%", data.root_attrs)
      .replace("%body%", data.body_content)
      .replace("%script%", data.script_content),
    { headers: { "content-type": "text/html;charset=utf-8" } }
  );
}
