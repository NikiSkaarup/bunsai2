import { plugged } from "bunsai/elysia";
import { render } from "../svelte/test.svelte";
import TestSvelte from "../svelte/test.svelte";
import TestReact from "../react/test";
import { table } from "bunsai/react";

const t = table({ TestReact });

const app = await plugged();

app
  // using component standalone render function
  .get("/", render)
  // using decorator
  .get("/decor", ({ render, ...context }) => render(TestSvelte, context))
  .get("/react", t.TestReact.render)
  .listen(3000);

console.log("Elysia Ready!");
