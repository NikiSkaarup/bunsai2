import { MapRouter } from "bunsai/map-router";
import * as Test from "./src/test.svelte";
import * as Ros from "./src/ros.svelte";
import "bunsai/with-config";

const router = new MapRouter().with([console.log], ({ route }) => {
  route("/ros/*", Ros);
  route("/:mama/?:test", Test);
});

Bun.serve({
  fetch: router.fetch,
});

console.log("MapRouter Serving");
