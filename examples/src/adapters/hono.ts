import { create } from "bunsai/hono";
import Test from "../svelte/test.svelte";
import "bunsai/with-config";
import logo from "../assets/logo.png";

const { handler, hono } = create();

const { fetch } = hono()
  .get("/assets/logo", () => new Response(Bun.file(logo)))
  // using 'create' handler function
  .get("/", handler(Test))
  // using component standalone render function
  .get("/test", Test.render);

Bun.serve({
  fetch,
});

console.log("Hono Ready!");
