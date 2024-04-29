import type { Context } from "elysia";

export function genScript(clientPath: string, context: Context) {
  return (
    '<script type="module">' +
    `import Component from "${clientPath}";` +
    `window.$sv_instance = new Component({hydrate:true,target:window.$sv_root,props:${JSON.stringify(
      { context, attrs: {} }
    )}})` +
    "</script>"
  );
}
