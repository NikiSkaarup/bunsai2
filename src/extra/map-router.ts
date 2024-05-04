import type { BunSai } from "../core";
import type { Module } from "../core/module";

export class MapRouter extends Map<
  string | RegExp,
  (context: Record<string, any>) => Response
> {
  fetch: (request: Request, context?: Record<string, any>) => Response;

  constructor(public result: BunSai) {
    super();

    result.declarations.forEach((decl) => this.set(decl.path, decl.handle));

    this.fetch = (request, context = {}) => {
      const { pathname } = new URL(request.url);

      for (const [key, render] of this) {
        if (key === pathname)
          return render({ ...context, request, match: pathname });

        if (key instanceof RegExp) {
          const match = key.exec(pathname);

          if (!match) continue;

          return render({ ...context, request, match });
        }
      }

      return new Response("NOT FOUND", {
        status: 404,
        statusText: "NOT FOUND",
      });
    };
  }

  add(matcher: string | RegExp, module: Module) {
    return this.set(matcher, (context) => this.result.render(module, context));
  }
}

export { default as bunsai } from "../core";
