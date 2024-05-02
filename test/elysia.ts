import { toPlugin, Elysia, bunsai } from "bunsai2/elysia";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const bunsaiPlugin = toPlugin(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
);

const app = new Elysia()
  .use(bunsaiPlugin)
  .get("/", () => Test)
  .get("/ros", () => Ros);

app.listen(3000);

console.log("Elysia Ready!");
