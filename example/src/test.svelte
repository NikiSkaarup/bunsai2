<script lang="ts">
  import { onMount } from "svelte";

  export let attrs: Record<string, any>;

  export let context;

  attrs.root_attrs = { "data-theme": "mais_vet" };

  console.log(context.match?.groups);

  onMount(() => console.log("mounted", context));
</script>

<div class="oi">oi</div>

<style>
  .oi {
    background-color: black;
  }
</style>
