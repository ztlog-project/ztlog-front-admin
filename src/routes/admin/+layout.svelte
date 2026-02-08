<script>
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';

  let sidebarOpen = false;
</script>

<div class="min-h-screen bg-bg">
  <Sidebar bind:open={sidebarOpen} />

  <div class="lg:ml-64 flex flex-col min-h-screen">
    <Header on:toggleSidebar={() => sidebarOpen = !sidebarOpen} />

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</div>
