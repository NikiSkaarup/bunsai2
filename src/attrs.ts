type Reserved<K extends string | number | symbol> = {
  /**
   * **RESERVED ATTRIBUTE**
   */
  [P in K]?: never;
};

export interface Attributes {
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

export type ProcessedRenderAttrs = Record<keyof Attributes, string>;

export const $renderAttrsQueue: ProcessedRenderAttrs[] = [];

function objToAttrs(obj: object) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

export class RenderAttrs {
  queue: Attributes[];
  isCapturing = false;
  currentCapture: Attributes[] | null = null;

  constructor() {
    this.queue = [];

    this.queue.push = (...items) => {
      if (this.isCapturing) {
        this.currentCapture = (this.currentCapture || []).concat(items);
      }

      return Array.prototype.push.apply(this.queue, items);
    };
  }

  startCapture() {
    if (this.isCapturing) throw new Error("already capturing attrs");

    this.isCapturing = true;
  }

  endCapture() {
    if (!this.isCapturing) throw new Error("not capturing attrs");

    this.isCapturing = false;

    const result = this.currentCapture || [];

    this.currentCapture = null;

    return result;
  }

  merge(items: Attributes[]) {
    return items.reduce((prev, curr) => ({ ...prev, ...curr }), {});
  }

  process(attrs: Attributes, defaults: Attributes): ProcessedRenderAttrs {
    if (attrs.root_attrs) delete attrs.root_attrs.id;
    if (defaults.root_attrs) delete defaults.root_attrs.id;

    return {
      body_attrs: objToAttrs(attrs.body_attrs || defaults.body_attrs || {}),
      fav_url: attrs.fav_url || defaults.fav_url || "",
      html_lang: attrs.html_lang || defaults.html_lang || "",
      root_attrs: objToAttrs(attrs.root_attrs || defaults.root_attrs || {}),
    };
  }
}
