import { log } from "./util";

log.loud(
  "Preloading BunSai is not needed since v2.0.0-preview.5.",
  "\nUnless you want to load BunSai as standalone;",
  "\nIn this case, add 'import \"bunsai/with-config\";'",
  "as the last import in the program entrypoint."
);
