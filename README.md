<p align="center"><img style="width: 25%" src="https://github.com/levii-pires/bunsai2/blob/main/assets/logo.png?raw=true"></p>

<h1 align="center">BunSai 2</h1>

> Bonsai is a japanese art of growing and shaping miniature trees in containers.
>
> Bun + Bonsai = BunSai

BunSai proposes to be the official SSR engine for [Bun](https://bun.sh).

It leverages some of the powers of Bun (like Bundler, preloading and plugin system) to create a fast, DX friendly library.

## Quick start

```bash
bun add bunsai@2 <the optional deps you are gonna use>
```

### Using Elysia

[`adapters/elysia.ts`](./examples/src/adapters/elysia.ts)

## How it works

BunSai is divided in 3 parts: Plugin, Adapter and Module.

### Plugin

A Plugin is the part of BunSai that converts things like Svelte code into a [BunSai Module](#module).

Let's take the builtin Svelte Plugin as an example:

```toml
# bunfig.toml
preload = ["bunsai/svelte/preload.ts"]
```

In the preload phase Svelte is added as a Bun plugin (which means you can import it runtime), and the browser version is added to BunSai's Browser Plugin Registry.

```jsonc
// tsconfig.json
{ "types": ["bunsai/global.d.ts", "bunsai/svelte/global.d.ts"] }
```

Then we add global declarations to make things prettier :)

> NOTE: if you use the Svelte Extension for VSCode, make sure the `Enable-TS-plugin` option is disabled
