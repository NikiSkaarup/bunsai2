<script>
  import { onMount } from "svelte";

  /**
   * @type {import('elysia-plugin-svelte/src').RenderAttributes}
   */
  export let attrs;

  export let context;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  onMount(() => console.log("mounted", context));
</script>

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
  }
</style>
