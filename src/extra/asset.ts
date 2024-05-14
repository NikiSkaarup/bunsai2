import URI from "urijs";

/**
 * Converts Bun asset import into a BunSai compatible URL.
 *
 * Must **NOT** be used in module scope.
 *
 * @example
 * import logo from "./assets/logo.png";
 *
 * asset(logo); // /__bunsai__/assets/logo.png
 */
export default function createAssetGetter(meta: ImportMeta) {
  const sourceURI = new URI(meta.url);

  if (sourceURI.protocol() == "file") {
    return (asset: string) => {
      const rootURI = new URI(
        "file://" + $global.$$$bunsai_build_root.replaceAll("\\", "/") + "/"
      );

      const assetURI = new URI("file://" + asset.replaceAll("\\", "/"));

      const relative = assetURI.relativeTo(rootURI.href()).pathname();

      return URI.joinPaths(
        "/",
        $global.$$$bunsai_build_prefix,
        "/",
        relative
      ).pathname();
    };
  }

  return (asset: string) => {
    return URI.joinPaths(
      "/",
      sourceURI.segment(0) || "/",
      "/",
      new URI(asset).absoluteTo("/")
    ).pathname();
  };
}

export type Asset = ReturnType<typeof createAssetGetter>;
const $global: any = typeof global != "undefined" ? global : {};
