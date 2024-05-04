import { create, bunsai } from "bunsai/hono";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const { handler, hono } = create(
  await bunsai({
    defaults: { attrs: { html_lang: "en" } },
  })
);

const { fetch } = hono()
  // using 'create' handler function
  .get("/", handler(Test))
  // using component standalone render function
  .get("/ros", Ros.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
