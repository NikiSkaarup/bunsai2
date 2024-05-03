import { create, bunsai } from "bunsai2/hono";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const { handler, hono } = create(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
);

const { fetch } = hono().get("/", handler(Test)).get("/ros", handler(Ros));

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
