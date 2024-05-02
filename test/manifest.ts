import { bunsai, createManifest } from "bunsai2/manifest";
import "./src/ros.svelte";
import "./src/test.svelte";

const buns = await bunsai();

if (buns) console.log(createManifest(buns));
