import { MapRouter, bunsai } from "bunsai/map-router";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";

const router = new MapRouter(await bunsai()).add("/", Test).add(/\/ros/, Ros);

Bun.serve({
  fetch: router.fetch,
});

console.log("MapRouter Serving");
