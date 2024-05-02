export namespace Util {
  export namespace log {
    export function debug(...data: any[]) {
      if (Bun.env.DEBUG) console.log("[bunsai2]:", ...data);
    }

    export function verbose(...data: any[]) {
      if (Bun.env.DEBUG == "verbose") console.log("[bunsai2]:", ...data);
    }
  }

  export namespace time {
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
  }
}
