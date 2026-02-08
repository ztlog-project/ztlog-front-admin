<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { authApi } from '$lib/api/auth.js';

  let userId = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleLogin() {
    if (!userId || !password) {
      error = '아이디와 비밀번호를 입력해주세요.';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await authApi.login(userId, password);
      if (res.code === 'SUCCESS' && res.data) {
        auth.login(res.data);
        goto('/admin');
      } else {
        error = res.message || '로그인에 실패했습니다.';
      }
    } catch (e) {
      error = e.message || '로그인 중 오류가 발생했습니다.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>로그인 - ZTLog Admin</title>
</svelte:head>

<div class="min-h-screen bg-bg flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-text">
        <span class="text-primary">ZT</span>Log Admin
      </h1>
      <p class="text-text-light mt-2">관리자 계정으로 로그인하세요</p>
    </div>

    <!-- Login Card -->
    <div class="bg-card rounded-lg shadow-lg border border-border p-8">
      {#if error}
        <div class="mb-4 p-3 bg-danger/10 text-danger text-sm rounded-lg">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleLogin}>
        <div class="mb-5">
          <label for="userId" class="block text-sm font-medium text-text mb-1.5">아이디</label>
          <input
            id="userId"
            type="text"
            bind:value={userId}
            placeholder="아이디를 입력하세요"
            disabled={loading}
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
              disabled:opacity-50"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-text mb-1.5">비밀번호</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="비밀번호를 입력하세요"
            disabled={loading}
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
              disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm
            hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-text-light mt-6">
      &copy; 2025 ZTLog. All rights reserved.
    </p>
  </div>
</div>
