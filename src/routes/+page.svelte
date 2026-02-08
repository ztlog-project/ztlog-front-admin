<script>
  import { redirect } from '@sveltejs/kit';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/login');
  });
</script>

<div class="min-h-screen bg-bg flex items-center justify-center">
  <p class="text-text-light">리다이렉트 중...</p>
</div>
