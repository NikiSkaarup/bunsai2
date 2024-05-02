import { bunsai, writeToDisk } from "bunsai2/file";
import "./src/ros.svelte";
import "./src/test.svelte";

await writeToDisk("./dist", await bunsai());
