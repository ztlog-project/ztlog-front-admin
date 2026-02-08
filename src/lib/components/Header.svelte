<script>
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { authApi } from '$lib/api/auth.js';

  const dispatch = createEventDispatcher();

  let showProfileMenu = false;
  let showNotifications = false;

  function toggleSidebar() {
    dispatch('toggleSidebar');
  }

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch (e) {
      // 로그아웃 API 실패해도 로컬 토큰은 제거
    }
    auth.logout();
    goto('/login');
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header class="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
  <!-- Left: Hamburger + Search -->
  <div class="flex items-center gap-4">
    <button on:click={toggleSidebar} class="lg:hidden text-text-light hover:text-text transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <div class="hidden sm:flex items-center bg-bg rounded-lg px-3 py-2">
      <svg class="w-4 h-4 text-text-light mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input type="text" placeholder="검색..." class="bg-transparent border-none outline-none text-sm text-text w-48" />
    </div>
  </div>

  <!-- Right: Notifications + Profile -->
  <div class="flex items-center gap-3">
    <!-- Notifications -->
    <div class="relative">
      <button
        on:click={() => { showNotifications = !showNotifications; showProfileMenu = false; }}
        class="relative p-2 text-text-light hover:text-text transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-white text-[10px] flex items-center justify-center">3</span>
      </button>

      {#if showNotifications}
        <div class="absolute right-0 top-full mt-2 w-72 bg-card rounded-lg shadow-lg border border-border py-2">
          <div class="px-4 py-2 border-b border-border">
            <h4 class="text-sm font-semibold text-text">알림</h4>
          </div>
          <div class="py-1">
            <a href="/admin" class="block px-4 py-2.5 hover:bg-bg transition-colors">
              <p class="text-sm text-text">새 댓글이 등록되었습니다</p>
              <p class="text-xs text-text-light mt-0.5">5분 전</p>
            </a>
            <a href="/admin" class="block px-4 py-2.5 hover:bg-bg transition-colors">
              <p class="text-sm text-text">게시물이 발행되었습니다</p>
              <p class="text-xs text-text-light mt-0.5">12분 전</p>
            </a>
            <a href="/admin" class="block px-4 py-2.5 hover:bg-bg transition-colors">
              <p class="text-sm text-text">새로운 방문자 알림</p>
              <p class="text-xs text-text-light mt-0.5">1시간 전</p>
            </a>
          </div>
        </div>
      {/if}
    </div>

    <!-- Profile -->
    <div class="relative">
      <button
        on:click={() => { showProfileMenu = !showProfileMenu; showNotifications = false; }}
        class="flex items-center gap-2 hover:bg-bg rounded-lg px-2 py-1.5 transition-colors"
      >
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">A</div>
        <span class="hidden sm:block text-sm text-text font-medium">Admin</span>
        <svg class="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {#if showProfileMenu}
        <div class="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2">
          <a href="/admin" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              프로필
            </span>
          </a>
          <a href="/admin" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              설정
            </span>
          </a>
          <div class="border-t border-border my-1"></div>
          <button on:click={handleLogout} class="w-full text-left block px-4 py-2 text-sm text-danger hover:bg-bg transition-colors">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if showNotifications || showProfileMenu}
  <div class="fixed inset-0 z-[5]" on:click={() => { showNotifications = false; showProfileMenu = false; }}></div>
{/if}
