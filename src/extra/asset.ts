import URI from "urijs";

const $global: any = typeof global != "undefined" ? global : {};

export function createAssetGetter(meta: ImportMeta) {
  const uri = new URI(meta.url);

  if (uri.protocol() == "file") {
    return (asset: string) => {
      const rootURI = new URI($global.$$$bunsai_build_root).protocol("file");

      const x = new URI(asset).protocol("file");

      console.log(rootURI.(x.pathname()).readable());

      return "";
    };
  }

  return (asset: string) => new URI(asset).absoluteTo(uri).pathname();
}

/**
 *   $global.$$$bunsai_build_root = resolve(root);
  $global.$$$bunsai_build_prefix = prefix;
 */
