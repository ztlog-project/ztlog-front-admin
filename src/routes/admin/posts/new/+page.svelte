<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { contentsApi } from '$lib/api/contents.js';
  import { tagsApi } from '$lib/api/tags.js';

  let title = '';
  let body = '';
  let selectedTags = [];
  let allTags = [];
  let saving = false;
  let error = '';

  onMount(async () => {
    try {
      const res = await tagsApi.getList(1);
      if (res.list) {
        allTags = res.list;
      } else if (res.data?.list) {
        allTags = res.data.list;
      }
    } catch (e) {
      // 태그 목록 로딩 실패는 무시
    }
  });

  function toggleTag(tagNo) {
    if (selectedTags.includes(tagNo)) {
      selectedTags = selectedTags.filter(t => t !== tagNo);
    } else {
      selectedTags = [...selectedTags, tagNo];
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      error = '제목과 내용을 입력해주세요.';
      return;
    }

    saving = true;
    error = '';

    try {
      const data = {
        title: title.trim(),
        body: body,
        tags: selectedTags.map(tagNo => ({ tagNo }))
      };
      await contentsApi.create(data);
      goto('/admin/posts');
    } catch (e) {
      error = e.message || '저장 중 오류가 발생했습니다.';
    } finally {
      saving = false;
    }
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

{#if error}
  <div class="mb-6 p-3 bg-danger/10 text-danger text-sm rounded-lg">{error}</div>
{/if}

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
            maxlength="100"
            required
            disabled={saving}
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
              disabled:opacity-50"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-text mb-1.5">내용</label>
          <textarea
            id="content"
            bind:value={body}
            placeholder="게시물 내용을 입력하세요..."
            rows="16"
            required
            disabled={saving}
            class="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white resize-y
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
              disabled:opacity-50"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Sidebar Settings -->
    <div class="space-y-6">
      <div class="bg-card rounded-lg shadow-sm border border-border p-6">
        <h3 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">태그</h3>

        {#if allTags.length > 0}
          <div class="flex flex-wrap gap-2 mb-6">
            {#each allTags as tag}
              <button
                type="button"
                on:click={() => toggleTag(tag.tagNo)}
                class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  {selectedTags.includes(tag.tagNo)
                    ? 'bg-primary text-white'
                    : 'bg-bg text-text-light hover:bg-border'}"
              >
                {tag.tagName}
              </button>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-text-light mb-6">등록된 태그가 없습니다.</p>
        {/if}

        <div class="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm
              hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
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
