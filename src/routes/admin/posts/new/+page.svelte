<script>
  import { goto } from '$app/navigation';
  import { categories } from '$lib/data/mock.js';

  let title = '';
  let content = '';
  let categoryId = '';
  let status = 'draft';

  function handleSubmit() {
    alert('게시물이 저장되었습니다 (목업)');
    goto('/admin/posts');
  }
</script>

<svelte:head>
  <title>새 글 작성 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6 flex items-center justify-between">
  <div>
    <h1 class="text-2xl font-bold text-text">새 글 작성</h1>
    <p class="text-sm text-text-light mt-1">새로운 블로그 게시물을 작성합니다</p>
  </div>
  <a href="/admin/posts" class="text-sm text-text-light hover:text-text transition-colors flex items-center gap-1">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    목록으로
  </a>
</div>

<form on:submit|preventDefault={handleSubmit}>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Main Content -->
    <div class="xl:col-span-2 space-y-6">
      <div class="bg-card rounded-lg shadow-sm border border-border p-6">
        <div class="mb-5">
          <label for="title" class="block text-sm font-medium text-text mb-1.5">제목</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            placeholder="게시물 제목을 입력하세요"
            required
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-text mb-1.5">내용</label>
          <textarea
            id="content"
            bind:value={content}
            placeholder="게시물 내용을 입력하세요..."
            rows="16"
            required
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white resize-y
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Sidebar Settings -->
    <div class="space-y-6">
      <!-- Publish Settings -->
      <div class="bg-card rounded-lg shadow-sm border border-border p-6">
        <h3 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">발행 설정</h3>

        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-text mb-1.5">상태</label>
          <select
            id="status"
            bind:value={status}
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            <option value="draft">임시저장</option>
            <option value="published">발행</option>
          </select>
        </div>

        <div class="mb-6">
          <label for="category" class="block text-sm font-medium text-text mb-1.5">카테고리</label>
          <select
            id="category"
            bind:value={categoryId}
            required
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            <option value="">카테고리 선택</option>
            {#each categories as cat}
              <option value={cat.id}>{cat.name}</option>
            {/each}
          </select>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm
              hover:bg-primary-dark transition-colors"
          >
            저장
          </button>
          <a
            href="/admin/posts"
            class="flex-1 py-2.5 bg-bg text-text-light rounded-lg font-medium text-sm text-center
              hover:bg-border transition-colors"
          >
            취소
          </a>
        </div>
      </div>
    </div>
  </div>
</form>
