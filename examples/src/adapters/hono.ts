import { create } from "bunsai/hono";
import Test from "../svelte/test.svelte";
import "bunsai/with-config";

const { handler, hono } = create();

const { fetch } = hono()
  // using 'create' handler function
  .get("/", handler(Test))
  // using component standalone render function
  .get("/test", Test.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
