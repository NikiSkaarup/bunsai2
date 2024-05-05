<script lang="ts">
  import { onMount } from "svelte";
  import type { Context } from "../../src/extra/map-router";

  export let attrs: Record<string, any>;

  export let context: Context;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  onMount(() => console.log("mounted", context));
</script>

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
  }
</style>
