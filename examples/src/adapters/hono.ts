import { plugged } from "bunsai/hono";
import SvelteTest from "../svelte/test.svelte";
import ReactTest from "../react/test";
import { react } from "bunsai/react";

const rRender = react(ReactTest).render;

const { handler, hono } = await plugged();

const { fetch } = hono()
  // using 'create' handler function
  .get("/", handler(SvelteTest))
  // using component standalone render function
  .get("/test", SvelteTest.render)
  .get("/react", rRender);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
