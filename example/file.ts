import { writeToDisk } from "bunsai/file";
import "./src/ros.svelte";
import "./src/test.svelte";
import "bunsai/with-config";

await writeToDisk("./dist");
