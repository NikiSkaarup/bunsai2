import { createManifest } from "bunsai/manifest";
import Test from "../svelte/test.svelte";
import logo from "../assets/logo.png";
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
      case "/assets/logo":
        return new Response(Bun.file(logo));
      default:
        return new Response("NOT FOUND", { status: 404 });
    }
  },
});

console.log("Serving");
