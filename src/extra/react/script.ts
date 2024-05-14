import type { ScriptData } from "../../core/script";

export function genScript(data: ScriptData) {
  return (
    '<script type="module">' +
    `import Component from "${data.clientPath}";` +
    `Component.$hydrate(${JSON.stringify(data.props)})` +
    "</script>"
  );
}
