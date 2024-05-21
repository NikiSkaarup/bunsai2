declare namespace NodeJS {
  export interface ProcessEnv {
    DEBUG?: "on" | "verbose" | "silent";
    // BUNSAI_USE_CONFIG?: string; not used
  }
}

declare interface Array<T> {
  mapAsync<R = T>(
    callbackfn: (value: T, index: number, array: T[]) => Promise<R> | R,
    thisArg?: any
  ): Promise<Array<R>>;
}
