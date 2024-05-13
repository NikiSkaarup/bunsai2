import { plugged } from "bunsai/hono";
import Test from "../svelte/test.svelte";

const { handler, hono } = await plugged();

const { fetch } = hono()
  // using 'create' handler function
  .get("/", handler(Test))
  // using component standalone render function
  .get("/test", Test.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
