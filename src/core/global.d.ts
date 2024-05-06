declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG?: "on" | "verbose" | "silent";
    BUNSAI_USE_CONFIG?: string;
  }
}
