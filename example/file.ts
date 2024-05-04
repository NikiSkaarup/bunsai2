import { bunsai, writeToDisk } from "bunsai/file";
import "./src/ros.svelte";
import "./src/test.svelte";

await writeToDisk("./dist", await bunsai());
