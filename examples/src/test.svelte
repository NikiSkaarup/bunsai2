<script lang="ts">
  import { onMount } from "svelte";
  import type { RenderAttributes } from "bunsai";

  export let attrs: RenderAttributes;

  export let context: Record<string, any>;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  onMount(() => console.log("mounted", context));
</script>

<img src="/assets/logo" alt="logo" />

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
    color: antiquewhite;
  }
</style>
