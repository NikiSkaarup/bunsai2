import { createManifest } from "bunsai/manifest";
import Test from "../svelte/test.svelte";
import "bunsai/with-config";

const { assets, render } = createManifest();

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);

    const matched = assets.get(url.pathname);

    if (matched) return matched();

    switch (url.pathname) {
      case "/":
        // using manifest render function
        return render(Test, { req });
      case "/test":
        // using component standalone render function
        return Test.render({ req });
      default:
        return new Response("NOT FOUND", { status: 404 });
    }
  },
});

console.log("Serving");
