import type { BunSai } from "../core";
import { writeToDisk } from "./file";

export class FileSystemRouter extends Bun.FileSystemRouter {
  private constructor(
    options: ConstructorParameters<typeof Bun.FileSystemRouter>[0]
  ) {
    super(options);
  }

  static async init(
    options: ConstructorParameters<typeof Bun.FileSystemRouter>[0] & {
      bunsai: BunSai;
    }
  ) {
    await writeToDisk(options.dir, options.bunsai);

    return new this(options);
  }
}

export { default as bunsai } from "../core";
