import type { BunSai } from "../core";
import { CurrentBunSai } from "../core/globals";
import type { Module } from "../core/module";
import { BunSaiLoadError } from "../core/util";

export type Context<C extends Record<string, any> = {}> = C & {
  request: Request;
  match: RegExpExecArray;
  url: URL;
  params: { catchall?: string } & Dict<string>;
};

export type Middleware<C extends Record<string, any>> = (
  context: Context<C>
) => Response | void;

interface Routes {
  add(matcher: RegExp, module: Module): this;
  route(route: string, module: Module): this;
}

export class MapRouter
  extends Map<RegExp, (context: Context) => Response>
  implements Routes
{
  result: BunSai;
  fetch: (request: Request, context?: Record<string, any>) => Response;
  /**
   * Can be overrided to provide a custom `NOT_FOUND` response
   */
  notFound: () => Response;

  constructor(result = CurrentBunSai()) {
    if (!result) throw new BunSaiLoadError();

    super();

    this.result = result;

    result.declarations.forEach((decl) =>
      this.set(new RegExp(decl.path.replaceAll(".", "\\.") + "$"), decl.handle)
    );

    this.notFound = () =>
      new Response("NOT_FOUND", {
        status: 404,
        statusText: "NOT_FOUND",
      });

    this.fetch = (request, context = {}) => {
      if (request.method != "GET")
        return new Response("MapRouter only supports GET requests", {
          status: 405,
        });

      const url = new URL(request.url);

      for (const [key, render] of this) {
        const match = key.exec(url.pathname);

        if (!match) continue;

        return render({
          ...context,
          request,
          url,
          match,
          params: match.groups || {},
        });
      }

      return this.notFound();
    };
  }

  /**
   * Add a module to the Router map
   */
  add(matcher: RegExp, module: Module) {
    return this.set(matcher, (context) => this.result.render(module, context));
  }

  /**
   * Same as {@link add}, but with support for route patterns:
   *
   * - Path param: `/:foo`
   * - Optional path param: `/?:foo`
   * - Wildcard: `/*` (will be registered on {@link Context.params params} as `catchall`)
   */
  route(route: string, module: Module) {
    return this.set(fromRoute(route), (context) =>
      this.result.render(module, context)
    );
  }

  with<C extends Record<string, any> = {}>(
    middlewares: Middleware<C>[],
    register: (routes: Routes) => void
  ) {
    const registrar: Routes = {
      add: (matcher, module) => {
        const caller = createMiddlewareCaller(middlewares);
        this.set(matcher, (context) => {
          const _result = caller(context as any);

          if (_result) return _result;

          return this.result.render(module, context);
        });

        return registrar;
      },
      route: (route, module) => {
        const caller = createMiddlewareCaller(middlewares);
        this.set(fromRoute(route), (context) => {
          const _result = caller(context as any);
          if (_result) return _result;

          return this.result.render(module, context);
        });

        return registrar;
      },
    };

    register(registrar);

    return this;
  }
}

function createMiddlewareCaller<C extends Record<string, any>>(
  middlewares: Middleware<C>[]
) {
  return (context: Context<C>) => {
    for (const mid of middlewares) {
      const result = mid(context);

      if (result) return result;
    }
  };
}

export function fromRoute(route: string) {
  return new RegExp(
    route
      .replaceAll(/\/\?\*$/g, "(?<catchall>/?.*)")
      .replaceAll(/\/\*$/g, "(?<catchall>/.+)")
      .replaceAll(/\/\?:([^\/]+)/g, "/?(?<$1>[^/]*)")
      .replaceAll(/\/:([^\/]+)/g, "/(?<$1>[^/]+)") + "$"
  );
}

export { default as bunsai } from "../core";
