import { bunsai, writeToDisk } from "bunsai2/file";
import "./src/ros.svelte";
import "./src/test.svelte";

const x = await writeToDisk("./dist", await bunsai());

if (x) {
  console.log(x.paths);
}
