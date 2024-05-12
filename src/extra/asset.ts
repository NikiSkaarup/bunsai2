import URI from "urijs";

const $global: any = typeof global != "undefined" ? global : {};

export function createAssetGetter(meta: ImportMeta) {
  const uri = new URI(meta.url);

  if (uri.protocol() == "file") {
    return (asset: string) => {
      const rootURI = new URI(
        "file://" + $global.$$$bunsai_build_root.replaceAll("\\", "/") + "/"
      );

      const assetURI = new URI("file://" + asset.replaceAll("\\", "/"));

      const relative = assetURI.relativeTo(rootURI.href()).href();

      return URI.joinPaths(
        "/",
        $global.$$$bunsai_build_prefix,
        "/",
        relative
      ).pathname();
    };
  }

  return (asset: string) => new URI(asset).absoluteTo(uri).pathname();
}
