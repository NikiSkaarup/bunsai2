<p align="center"><img style="width: 25%" src="https://github.com/levii-pires/bunsai2/blob/main/assets/logo.png?raw=true"></p>

<h1 align="center">BunSai 2</h1>

> Bonsai is a japanese art of growing and shaping miniature trees in containers.
>
> Bun + Bonsai = BunSai

BunSai proposes to be the official SSR engine for [Bun](https://bun.sh).

It leverages some of the powers of Bun (like Bundler, preloading and plugin system) to create a fast, DX friendly library.

## How it works

BunSai is divided in two parts: Plugins and Adapters.

### Plugin

A Plugin is the part of BunSai that converts things like Vue and Svelte code into a [BunSai Module](#bunsai-module).
