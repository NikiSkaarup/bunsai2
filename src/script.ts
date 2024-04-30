export interface ScriptData {
  clientPath: string;
}

export function genScript(data: ScriptData) {
  return (
    '<script type="module">' +
    `import Component from "${data.clientPath}";` +
    `window.$sv_instance = new Component({hydrate:true,target:window.$sv_root,props:${JSON.stringify(
      { context: null, attrs: {}, isServer: false }
    )}})` +
    "</script>"
  );
}
