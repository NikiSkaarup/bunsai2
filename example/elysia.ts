import { plug } from "bunsai/elysia";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";
import "bunsai/with-config";

const app = plug()
  .get("/", Test.render)
  .get("/ros", ({ render, ...context }) => render(Ros, context))
  .listen(3000);

console.log("Elysia Ready!");
