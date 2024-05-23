import { plugged } from "bunsai/elysia";
import TestSvelte from "../svelte/test.svelte";
import TestReact from "../react/test";
import { table } from "bunsai/react";

const t = table({ TestReact });

const { elysia, handler } = await plugged();

elysia()
  // using 'plugged' handler function
  .get("/", handler(TestSvelte))
  // using decorator
  .get("/decor", ({ render, ...context }) => render(TestSvelte, context))
  // using component standalone render function
  .get("/react", t.TestReact.render)
  .listen(3000);

console.log("Elysia Ready!");
