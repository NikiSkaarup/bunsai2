<script lang="ts" context="module">
  import { onMount } from "svelte";
  import type { RenderAttributes } from "bunsai";
  import { createAssetGetter } from "bunsai/asset";
  import logo from "../assets/logo.png";

  const asset = createAssetGetter(import.meta);
</script>

<script lang="ts">
  export let attrs: RenderAttributes;

  console.log(asset(logo));
  export let context: Record<string, any>;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  onMount(() => console.log("mounted", context));
</script>

<img src={asset(logo)} alt="logo" />

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
    color: antiquewhite;
  }
</style>
