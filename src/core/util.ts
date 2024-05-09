export namespace Util {
  /**
   * `console.log` according to `DEBUG` settings
   */
  export namespace log {
    /**
     * log if DEBUG env is set
     */
    export function debug(...data: any[]) {
      if (Bun.env.DEBUG) console.log("[bunsai2]:", ...data);
    }

    /**
     * log if DEBUG env is equal to `verbose`
     */
    export function verbose(...data: any[]) {
      if (Bun.env.DEBUG == "verbose") console.log("[bunsai2]:", ...data);
    }

    /**
     * log if DEBUG env is **not** equal to `silent`
     */
    export function loud(...data: any[]) {
      if (Bun.env.DEBUG != "silent") console.log("[bunsai2]:", ...data);
    }
  }

  /**
   * `console.time` according to `DEBUG` settings
   */
  export namespace time {
    /**
     * time if DEBUG env is set
     */
    export function debug(label?: string) {
      if (Bun.env.DEBUG) {
        const initial = performance.now();

        return () => {
          const diff = performance.now() - initial;
          const mdiff = diff / 1000;
          const time =
            mdiff >= 1.0 ? mdiff.toFixed(3) + "s" : diff.toFixed(0) + "ms";
          console.log("[bunsai2]:", label, "[" + time + "]");
        };
      }

      return () => {};
    }

    /**
     * time if DEBUG env is equal to `verbose`
     */
    export function verbose(label?: string) {
      if (Bun.env.DEBUG == "verbose") {
        const initial = performance.now();

        return () => {
          const diff = performance.now() - initial;
          const mdiff = diff / 1000;
          const time =
            mdiff >= 1.0 ? mdiff.toFixed(2) + "s" : diff.toFixed(0) + "ms";
          console.log("[bunsai2]:", label, "[" + time + "]");
        };
      }

      return () => {};
    }

    /**
     * time if DEBUG env is **not** equal to `silent`
     */
    export function loud(label: string) {
      if (Bun.env.DEBUG != "silent") {
        const initial = performance.now();

        return () => {
          const diff = performance.now() - initial;
          const mdiff = diff / 1000;
          const time =
            mdiff >= 1.0 ? mdiff.toFixed(2) + "s" : diff.toFixed(0) + "ms";
          console.log("[bunsai2]:", label, "[" + time + "]");
        };
      }

      return () => {};
    }
  }
}

export function createHolder<T>(initial?: T) {
  let value = initial;

  return (newValue?: T) => {
    if (newValue != undefined) {
      value = newValue;
    }

    return value;
  };
}

export type Holder<T> = ReturnType<typeof createHolder<T>>;

export class BunSaiLoadError extends Error {
  name = "BunSaiLoadError";
  constructor(options?: ErrorOptions, noProvide = false) {
    super(
      "Could not get current bunsai from globals" +
        (noProvide ? "." : ", and you did not provide one"),
      options
    );
  }
}
