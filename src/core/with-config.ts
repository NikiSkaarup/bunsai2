import { resolve } from "path";
import { Util } from "./util";
import bunsai from ".";

let config: any;

try {
  ({ default: config } = await import(resolve("./bunsai.config.ts")));
} catch (err) {
  Util.log.debug(err);
} finally {
  if (!config) Util.log.loud("Using BunSai with default settings");
}

await bunsai(config);
