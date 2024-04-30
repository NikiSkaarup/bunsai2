import Elysia from "elysia";
import svelte from "elysia-plugin-svelte";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const app = new Elysia()
  .use(await svelte({ defaults: { attrs: { html_lang: "en" } } }))
  .get("/", () => Test)
  .get("/ros", () => Ros)
  .listen(3000);

console.log("Ready!");
