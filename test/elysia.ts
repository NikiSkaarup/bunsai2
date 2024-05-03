import { plug, bunsai } from "bunsai2/elysia";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const app = plug(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
);

app
  .get("/", () => Test)
  .get("/ros", () => Ros)
  .listen(3000);

console.log("Elysia Ready!");
