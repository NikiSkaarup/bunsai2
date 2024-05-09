import { plug, Elysia } from "bunsai/elysia";
import { render } from "../test.svelte";
import "bunsai/with-config";
import logo from "../assets/logo.png";

const assets = new Elysia({ prefix: "/assets" }).get("/logo", Bun.file(logo));

const app = plug().use(assets).get("/", render).listen(3000);

console.log("Elysia Ready!");
