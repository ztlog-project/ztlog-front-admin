<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { auth } from '$lib/stores/auth.js';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';

  let sidebarOpen = false;
  let checked = false;

  onMount(() => {
    const unsubscribe = auth.subscribe(value => {
      if (!value && browser) {
        goto('/login');
      } else {
        checked = true;
      }
    });
    return unsubscribe;
  });
</script>

{#if checked}
  <div class="min-h-screen bg-bg">
    <Sidebar bind:open={sidebarOpen} />

    <div class="lg:ml-64 flex flex-col min-h-screen">
      <Header on:toggleSidebar={() => sidebarOpen = !sidebarOpen} />

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <div class="text-text-light">로딩 중...</div>
  </div>
{/if}
