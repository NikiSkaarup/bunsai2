import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";
import { cp } from "fs/promises";
import { dumpFolder } from "../core/build";

export function writeToDisk(outFolder: string, result = CurrentBunSai()) {
  if (!result) throw new BunSaiLoadError();

  return cp(dumpFolder, outFolder, { recursive: true });
}

export { default as bunsai } from "../core";
