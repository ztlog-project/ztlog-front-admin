<script>
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';

  function handleLogin() {
    goto('/admin');
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
      <form on:submit|preventDefault={handleLogin}>
        <div class="mb-5">
          <label for="email" class="block text-sm font-medium text-text mb-1.5">이메일</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="admin@example.com"
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-text mb-1.5">비밀번호</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="비밀번호를 입력하세요"
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div class="flex items-center justify-between mb-6">
          <label class="flex items-center gap-2 text-sm text-text-light cursor-pointer">
            <input type="checkbox" class="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            로그인 상태 유지
          </label>
          <a href="/login" class="text-sm text-primary hover:text-primary-dark transition-colors">비밀번호 찾기</a>
        </div>

        <button
          type="submit"
          class="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm
            hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          로그인
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-text-light mt-6">
      &copy; 2025 ZTLog. All rights reserved.
    </p>
  </div>
</div>
