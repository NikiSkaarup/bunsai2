<p align="center"><img style="width: 25%" src="https://github.com/levii-pires/bunsai2/blob/main/assets/logo.png?raw=true"></p>

<h1 align="center">BunSai 2</h1>

> Bonsai is a japanese art of growing and shaping miniature trees in containers.
>
> Bun + Bonsai = BunSai

BunSai proposes to be the official SSR engine for [Bun](https://bun.sh).

It leverages some of the powers of Bun (like Bundler, preloading and plugin system) to create a fast, DX friendly library.

> NOTE: the full documentation is coming soon...

## Quick start

```bash
bun add bunsai@2 <the optional deps you are gonna use>
```

| Framework/API                                       | Example                                                       |
| --------------------------------------------------- | ------------------------------------------------------------- |
| [Elysia](https://elysiajs.com/)                     | [`adapters/elysia.ts`](./examples/src/adapters/elysia.ts)     |
| [Hono](https://hono.dev/)                           | [`adapters/hono.ts`](./examples/src/adapters/hono.ts)         |
| [Bun.serve](https://bun.sh/docs/api/http#bun-serve) | [`adapters/manifest.ts`](./examples/src/adapters/manifest.ts) |
| [Bun.write](https://bun.sh/docs/api/file-io)        | [`adapters/file.ts`](./examples/src/adapters/file.ts)         |
| [Byte](https://bytejs.pages.dev/)                   | `Coming soon...`                                              |
| Static Build                                        | `Coming soon...`                                              |

### Dev mode

To run on dev mode, just use Bun `--hot` flag and add:

```properties
# .env
DEBUG=on
```

> NOTE: Browser HMR is not yet supported

### BunSai entrypoint

BunSai has an entrypoint (a function) that must be called after all modules are imported and before begining the use of those modules.

```ts
import A from "./module-a";
import B from "./module-b";
import C from "./module-c";

import bunsai from "bunsai";
// or
import { bunsai } from "bunsai/<adapter>";

const result = await bunsai(/* config here */);

/* your code here */
```

BunSai also offers a convenience tool:

```ts
import "bunsai/with-config"; // WRONG
import A from "./module-a";
import B from "./module-b";
import "bunsai/with-config"; // WRONG
import C from "./module-c";

import "bunsai/with-config"; // RIGHT

/* your code here */
```

```ts
// bunsai.config.ts

import type { BunsaiConfig } from "bunsai";

const config: BunsaiConfig = {
  /* ... */
};

export default config;
```

## Helpers

BunSai has (currently) 1 helper: `asset`.

### Asset

No big deal, just a helper function to allow you to use Bun asset import across BunSai (both server and client side):

> NOTE: Svelte plugin automatically injects it and makes it available module scope as `asset`.
> You can opt out by setting `SvelteConfig.bunsai2.useAsset` to `false`.

```ts
import createAssetGetter from "bunsai/asset";
import myPng from "./asset.png";

const asset = createAssetGetter(import.meta);

asset(myPng);
```

## How it works

BunSai is divided in 3 parts: Plugin, Adapter and Module.

### Plugin

A Plugin is the part of BunSai that converts things like Svelte code into a [BunSai Module](#module).

Let's take the builtin Svelte Plugin as an example:

```toml
# bunfig.toml
preload = ["bunsai/svelte/preload.ts"]
```

```jsonc
// tsconfig.json
{
  // Svelte global references 'bunsai/global.d.ts',
  // so if you are not using Svelte, you should include it yourself
  "types": ["bunsai/svelte/global.d.ts"]
}
```

> NOTE: if you use the Svelte Extension for VSCode, make sure the `Enable-TS-plugin` option is disabled

> NOTE: The Svelte plugin uses config file (`svelte.config.ts`). For proper typing, please use the global `SvelteConfig` type

### Adapter

As the name implies, an adapter adapts the BunSai Result (a.k.a. build) to be consumed by another Framework/API.

This time we'll take the Elysia adapter:

```ts
import { plug, plugged, bunsai, Elysia } from "bunsai/elysia";
import { render } from "./module.svelte";

const result = await bunsai();
// or
import "bunsai/with-config";

/* 
  If you are going to use 'bunsai/with-config',
  the adapter will try to get the result from the global scope.
  You dont even need to store the 'bunsai()' returned value,
  nor pass it to the adapter entrypoint ('plug' in this case).
*/

/*
  Or you can use 'plugged' and "ignore" both 'bunsai()' and 'bunsai/with-config'
*/
await plugged();

// as plugin
const app = new Elysia().use(plug(result)).get("/", render).listen(3000);

// as the main instance
const app = plug(result).get("/", render).listen(3000);

console.log("Elysia Ready!");
```

### Module

The module is just an Svelte file (in our case). It is the plugin's sole responsibility to transpile/adapt the source code into a BunSai Module.

The Svelte plugin uses `svelte/compiler` to transpile our source code into vanilla javascript, then it injects BunSai's `register` function and makes changes to exports so it can be consumed as an out-of-the-box BunSai Module.

> Check the [StandaloneModule](./src/core/module.ts) interface
