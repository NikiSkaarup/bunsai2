import type { BunsaiConfig } from "../src/core";

const config: BunsaiConfig = {
  prefix: "/_example_/",
  root: "./src",
  defaults: {
    attrs: {
      html_lang: "en",
      root_attrs: { style: "width: 100%; height:100%" },
    },
  },
};

export default config;
