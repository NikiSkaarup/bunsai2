import { writeToDisk } from "bunsai/file";
import { react } from "bunsai/react";
import "../svelte/test.svelte";
import T from "../react/test";

react(T);

import "bunsai/with-config";

await writeToDisk("./dist");

console.log("wrote files to './dist'");
