import { writeToDisk } from "bunsai/file";
import "../svelte/test.svelte";
import "bunsai/with-config";

await writeToDisk("./dist");
