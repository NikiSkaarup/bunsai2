import { resolve } from "path";
import { log } from "./util";
import bunsai from ".";

let config: any;

try {
  ({ default: config } = await import(resolve("./bunsai.config.ts")));
} catch (err) {
  log.debug(err);
} finally {
  if (!config) log.loud("Using BunSai with default settings");
}

export default await bunsai(config);
