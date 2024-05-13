<script lang="ts">
  import { onMount } from "svelte";
  import type { RenderAttributes } from "bunsai";
  import logo from "../assets/logo.webp";

  export let attrs: RenderAttributes;

  export let context: Record<string, any>;

  attrs.root_attrs = {
    "data-theme": "my-theme",
  };

  onMount(() => {
    console.log("mounted", context);
  });
</script>

<svelte:head>
  <style>
    body {
      width: 100vw;
      height: 100vh;
    }
  </style>
</svelte:head>

<div class="wrapper">
  <div class="logo-wrapper">
    <!-- svelte-ignore missing-declaration -->
    <img src={asset(logo)} alt="logo" class="logo" />
  </div>

  <div class="wel">BunSai + Svelte</div>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .logo-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo {
        width: 25%;
        animation: pulse 1s ease infinite;
      }

      @keyframes pulse {
        50% {
          transform: scale(105%);
        }
      }
    }

    .wel {
      margin-top: 2rem;
      font-family: monospace;
      font-size: 3rem;
      width: 100%;
      text-align: center;
    }
  }
</style>
