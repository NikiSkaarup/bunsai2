type Reserved<K extends string | number | symbol> = {
  /**
   * **RESERVED ATTRIBUTE**
   */
  [P in K]?: never;
};

export interface RenderAttrs {
  /**
   * Set (or override the default) `body` attributes.
   */
  body_attrs?: Record<string, string>;
  /**
   * Set (or override the default) root element attributes.
   *
   * **NOTE:** `id` is a reserved attribute.
   */
  root_attrs?: Record<string, string> & Reserved<"id">;
  /**
   * Set (or override the default) html lang.
   */
  html_lang?: string;
  /**
   * Set (or override the default) favicon url.
   */
  fav_url?: string;
}

export type ProcessedRenderAttrs = Record<keyof RenderAttrs, string>;

export const $renderAttrsQueue: ProcessedRenderAttrs[] = [];

function objToAttrs(obj: object) {
  return Object.values(obj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

export function enqueueRenderAttrs(attrs: RenderAttrs, defaults: RenderAttrs) {
  if (attrs.root_attrs) delete attrs.root_attrs.id;
  if (defaults.root_attrs) delete defaults.root_attrs.id;

  $renderAttrsQueue.push({
    body_attrs: objToAttrs(attrs.body_attrs || defaults.body_attrs || {}),
    fav_url: attrs.fav_url || defaults.fav_url || "",
    html_lang: attrs.html_lang || defaults.html_lang || "",
    root_attrs: objToAttrs(attrs.root_attrs || defaults.root_attrs || {}),
  });
}
