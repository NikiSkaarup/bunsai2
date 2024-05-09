import { writeToDisk } from "bunsai/file";
import "../test.svelte";
import "bunsai/with-config";

await writeToDisk("./dist");
