import { plugged } from "bunsai/hono";
import SvelteTest from "../svelte/test.svelte";
import ReactTest from "../react/test";
import { table } from "bunsai/react";

const t = table({ ReactTest });

const { handler, hono } = await plugged();

const { fetch } = hono()
  // using 'plugged' handler function
  .get("/", handler(SvelteTest))
  // using component standalone render function
  .get("/test", SvelteTest.render)
  .get("/react", t.ReactTest.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
