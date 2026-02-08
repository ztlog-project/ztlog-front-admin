<script>
  import Pagination from '$lib/components/Pagination.svelte';
  import { posts } from '$lib/data/mock.js';

  let searchQuery = '';
  let currentPage = 1;
  const perPage = 8;

  $: filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  $: totalPages = Math.ceil(filteredPosts.length / perPage);
  $: pagedPosts = filteredPosts.slice((currentPage - 1) * perPage, currentPage * perPage);

  function handlePageChange(e) {
    currentPage = e.detail;
  }

  function deletePost(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
      // mock: 실제로는 API 호출
      alert('삭제되었습니다 (목업)');
    }
  }
</script>

<svelte:head>
  <title>게시물 목록 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 class="text-2xl font-bold text-text">게시물 관리</h1>
    <p class="text-sm text-text-light mt-1">총 {filteredPosts.length}개의 게시물</p>
  </div>
  <a
    href="/admin/posts/new"
    class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium
      hover:bg-primary-dark transition-colors"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    새 글 작성
  </a>
</div>

<!-- Search & Filter -->
<div class="bg-card rounded-lg shadow-sm border border-border mb-6">
  <div class="p-4">
    <div class="flex items-center bg-bg rounded-lg px-3 py-2">
      <svg class="w-4 h-4 text-text-light mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="제목 또는 카테고리로 검색..."
        class="bg-transparent border-none outline-none text-sm text-text w-full"
        on:input={() => currentPage = 1}
      />
    </div>
  </div>
</div>

<!-- Posts Table -->
<div class="bg-card rounded-lg shadow-sm border border-border">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-border">
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-10">#</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">제목</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">카테고리</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">상태</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">작성일</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">조회수</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">액션</th>
        </tr>
      </thead>
      <tbody>
        {#each pagedPosts as post, i}
          <tr class="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
            <td class="px-6 py-3.5 text-sm text-text-light">{(currentPage - 1) * perPage + i + 1}</td>
            <td class="px-6 py-3.5">
              <a href="/admin/posts/{post.id}" class="text-sm text-text hover:text-primary transition-colors font-medium">
                {post.title}
              </a>
            </td>
            <td class="px-6 py-3.5">
              <span class="text-sm text-text-light">{post.category}</span>
            </td>
            <td class="px-6 py-3.5">
              {#if post.status === 'published'}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">발행</span>
              {:else}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">임시저장</span>
              {/if}
            </td>
            <td class="px-6 py-3.5 text-sm text-text-light">{post.date}</td>
            <td class="px-6 py-3.5 text-sm text-text-light">{post.views.toLocaleString()}</td>
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-2">
                <a
                  href="/admin/posts/{post.id}"
                  class="p-1.5 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="수정"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>
                <button
                  on:click={() => deletePost(post.id)}
                  class="p-1.5 text-text-light hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
                  title="삭제"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if filteredPosts.length === 0}
    <div class="p-12 text-center">
      <p class="text-text-light">검색 결과가 없습니다.</p>
    </div>
  {/if}

  <div class="px-6 py-4 border-t border-border">
    <Pagination {currentPage} {totalPages} on:pageChange={handlePageChange} />
  </div>
</div>
