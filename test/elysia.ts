import { toElysia, bunsai } from "bunsai2/elysia";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const app = toElysia(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
)
  .get("/", () => Test)
  .get("/ros", () => Ros);

app.listen(3000);

console.log("Elysia Ready!");
