import { bunsai, createManifest } from "bunsai2/manifest";
import * as Ros from "./src/ros.svelte";
import * as Test from "./src/test.svelte";

const { manifest, render } = createManifest(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
);

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);

    const matched = manifest.get(url.pathname);

    if (matched) return matched();

    switch (url.pathname) {
      case "/":
        return render(Test, { req });
      case "/ros":
        return render(Ros, { req });
      default:
        return new Response("NOT FOUND", { status: 404 });
    }
  },
});

console.log("Serving");
