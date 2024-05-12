import { plug } from "bunsai/elysia";
import { render } from "../svelte/test.svelte";
import "bunsai/with-config";

const app = plug().get("/", render).listen(3000);

console.log("Elysia Ready!");
