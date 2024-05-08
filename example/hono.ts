import { create } from "bunsai/hono";
import Test from "./src/test.svelte";
import Ros from "./src/ros.svelte";
import "bunsai/with-config";

const { handler, hono } = create();

const { fetch } = hono()
  // using 'create' handler function
  .get("/", handler(Test))
  // using component standalone render function
  .get("/ros", Ros.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
