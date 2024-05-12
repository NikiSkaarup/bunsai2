<script lang="ts" context="module">
  import { onMount } from "svelte";
  import type { RenderAttributes } from "bunsai";
  import logo from "../assets/logo.webp";
</script>

<script lang="ts">
  export let attrs: RenderAttributes;

  export let context: Record<string, any>;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  onMount(() => console.log("mounted", context));
</script>

<!-- svelte-ignore missing-declaration -->
<img src={asset(logo)} alt="logo" />

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
    color: antiquewhite;
  }
</style>
