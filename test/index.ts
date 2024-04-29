import Elysia from "elysia";
import svelte from "elysia-plugin-svelte/src";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

new Elysia()
  .use(await svelte({ defaults: { attrs: { html_lang: "en" } } }))
  .get("/", () => Test)
  .get("/ros", () => Ros)
  .listen(3000);
