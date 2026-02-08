<script>
  import { createEventDispatcher } from 'svelte';

  export let currentPage = 1;
  export let totalPages = 1;

  const dispatch = createEventDispatcher();

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      dispatch('pageChange', page);
    }
  }

  $: pages = Array.from({ length: totalPages }, (_, i) => i + 1);
</script>

{#if totalPages > 1}
  <div class="flex items-center justify-center gap-1 mt-6">
    <button
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      class="px-3 py-2 text-sm rounded-lg border border-border transition-colors
        {currentPage === 1 ? 'text-text-light cursor-not-allowed bg-bg' : 'text-text hover:bg-primary hover:text-white hover:border-primary'}"
    >
      이전
    </button>

    {#each pages as p}
      <button
        on:click={() => goToPage(p)}
        class="w-9 h-9 text-sm rounded-lg border transition-colors
          {p === currentPage ? 'bg-primary text-white border-primary' : 'border-border text-text hover:bg-primary hover:text-white hover:border-primary'}"
      >
        {p}
      </button>
    {/each}

    <button
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      class="px-3 py-2 text-sm rounded-lg border border-border transition-colors
        {currentPage === totalPages ? 'text-text-light cursor-not-allowed bg-bg' : 'text-text hover:bg-primary hover:text-white hover:border-primary'}"
    >
      다음
    </button>
  </div>
{/if}
