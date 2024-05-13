import { plugged } from "bunsai/elysia";
import { render } from "../svelte/test.svelte";
import Test from "../svelte/test.svelte";

const app = await plugged();

app
  // using component standalone render function
  .get("/", render)
  // using decorator
  .get("/decor", ({ render, ...context }) => render(Test, context))
  .listen(3000);

console.log("Elysia Ready!");
