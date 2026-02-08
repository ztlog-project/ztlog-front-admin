<script>
  import { page } from '$app/stores';

  export let open = true;

  const menuItems = [
    {
      label: '대시보드',
      href: '/admin',
      icon: 'dashboard'
    },
    {
      label: '게시물',
      icon: 'article',
      children: [
        { label: '목록', href: '/admin/posts' },
        { label: '새 글 작성', href: '/admin/posts/new' }
      ]
    },
    {
      label: '카테고리',
      href: '/admin/categories',
      icon: 'category'
    }
  ];

  let expandedMenus = { '게시물': true };

  function toggleMenu(label) {
    expandedMenus[label] = !expandedMenus[label];
  }

  function isActive(href) {
    return $page.url.pathname === href;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if open}
  <div class="fixed inset-0 bg-black/50 z-20 lg:hidden" on:click={() => open = false}></div>
{/if}

<aside class="fixed top-0 left-0 h-full w-64 bg-sidebar z-30 transition-transform duration-300 flex flex-col
  {open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0">

  <!-- Logo -->
  <div class="h-16 flex items-center px-6 border-b border-white/10">
    <a href="/admin" class="text-white text-xl font-bold tracking-wide">
      <span class="text-primary">ZT</span>Log Admin
    </a>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4">
    <ul class="space-y-1">
      {#each menuItems as item}
        <li>
          {#if item.children}
            <!-- Parent menu with children -->
            <button
              on:click={() => toggleMenu(item.label)}
              class="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors"
            >
              <span class="flex items-center gap-3">
                {#if item.icon === 'article'}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                {/if}
                {item.label}
              </span>
              <svg class="w-4 h-4 transition-transform {expandedMenus[item.label] ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {#if expandedMenus[item.label]}
              <ul class="bg-black/20">
                {#each item.children as child}
                  <li>
                    <a
                      href={child.href}
                      class="block pl-14 pr-6 py-2.5 text-sm transition-colors
                        {isActive(child.href) ? 'text-white bg-sidebar-active' : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'}"
                    >
                      {child.label}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          {:else}
            <!-- Single menu item -->
            <a
              href={item.href}
              class="flex items-center gap-3 px-6 py-3 text-sm transition-colors
                {isActive(item.href) ? 'text-white bg-sidebar-active border-r-3 border-primary' : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'}"
            >
              {#if item.icon === 'dashboard'}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              {:else if item.icon === 'category'}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              {/if}
              {item.label}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Footer -->
  <div class="p-4 border-t border-white/10">
    <div class="flex items-center gap-3 px-2">
      <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">A</div>
      <div>
        <p class="text-white text-sm font-medium">Admin</p>
        <p class="text-gray-400 text-xs">관리자</p>
      </div>
    </div>
  </div>
</aside>
