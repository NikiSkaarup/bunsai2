import URI from "urijs";
import { CurrentBunSai } from "../core/globals";
import { BunSaiLoadError } from "../core/util";

/**
 * Converts Bun asset import into a BunSai compatible URL.
 *
 * Must **NOT** be used in module scope.
 *
 *  **NOTE:** In some cases this function generates incorrect client side paths. Use {@link Asset.abs}
 *
 * @example
 * import logo from "./assets/logo.png";
 *
 * asset(logo); // /__bunsai__/assets/logo.png
 */
export default function createAssetGetter(meta: ImportMeta): Asset {
  const sourceURI = new URI(meta.url);

  if (sourceURI.protocol() == "file") {
    const asset = (asset: string) => {
      const curr = CurrentBunSai();

      if (!curr) throw new BunSaiLoadError(undefined, true);

      const rootURI = new URI(
        "file://" + curr.root.replaceAll("\\", "/") + "/"
      );

      const assetURI = new URI("file://" + asset.replaceAll("\\", "/"));

      const relative = assetURI.relativeTo(rootURI.href()).pathname();

      return URI.joinPaths("/", curr.prefix, "/", relative).pathname();
    };

    asset.abs = asset;

    return asset;
  }

  const asset = (asset: string) => {
    return URI.joinPaths(
      "/",
      sourceURI.segment(0) || "/",
      "/",
      new URI(asset).absoluteTo("/")
    ).pathname();
  };

  asset.abs = (asset: string) =>
    new URI(asset).absoluteTo(sourceURI).pathname();

  return asset;
}

/**
 * Converts Bun asset import into a BunSai compatible URL.
 *
 * Must **NOT** be used in module scope.
 *
 * **NOTE:** In some cases this function generates incorrect client side paths. Use {@link Asset.abs}
 *
 * @example
 * import logo from "./assets/logo.png";
 *
 * asset(logo); // /__bunsai__/assets/logo.png
 */
export interface Asset {
  /**
   * Converts Bun asset import into a BunSai compatible URL.
   *
   * Must **NOT** be used in module scope.
   *
   * **NOTE:** In some cases this function generates incorrect client side paths. Use {@link Asset.abs}
   *
   * @example
   * import logo from "./assets/logo.png";
   *
   * asset(logo); // /__bunsai__/assets/logo.png
   */
  (asset: string): string;

  /**
   * In some cases the main function generates incorrect client side paths.
   *
   * `abs` has a different client side implementation to handle assets that were not "pushed" to
   * a chunk (i.e. imported by multiple files).
   *
   * Must **NOT** be used in module scope.
   *
   */
  abs(asset: string): string;
}
