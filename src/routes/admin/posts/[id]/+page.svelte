<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { contentsApi } from '$lib/api/contents.js';
  import { tagsApi } from '$lib/api/tags.js';

  $: ctntNo = parseInt($page.params.id);

  let post = null;
  let title = '';
  let body = '';
  let selectedTags = [];
  let allTags = [];
  let loading = true;
  let saving = false;
  let error = '';

  onMount(async () => {
    try {
      const [contentRes, tagsRes] = await Promise.all([
        contentsApi.getDetail(ctntNo),
        tagsApi.getList(1)
      ]);

      if (contentRes.data) {
        post = contentRes.data;
        title = post.title || '';
        body = post.body || '';
        if (post.tags) {
          selectedTags = post.tags.map(t => t.tagNo);
        }
      }

      if (tagsRes.list) {
        allTags = tagsRes.list;
      } else if (tagsRes.data?.list) {
        allTags = tagsRes.data.list;
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
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
      await contentsApi.update({
        ctntNo,
        title: title.trim(),
        body: body,
        tags: selectedTags.map(tagNo => ({ tagNo }))
      });
      goto('/admin/posts');
    } catch (e) {
      error = e.message || '수정 중 오류가 발생했습니다.';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>{post ? post.title + ' 수정' : '게시물 수정'} - ZTLog Admin</title>
</svelte:head>

{#if loading}
  <div class="flex items-center justify-center py-20">
    <div class="text-text-light">로딩 중...</div>
  </div>
{:else if !post && error}
  <div class="text-center py-12">
    <p class="text-danger text-lg mb-4">{error}</p>
    <a href="/admin/posts" class="text-primary hover:text-primary-dark">목록으로 돌아가기</a>
  </div>
{:else if post}
  <!-- Page Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-text">게시물 수정</h1>
      <p class="text-sm text-text-light mt-1">게시물 ID: {ctntNo}</p>
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
            <div class="flex flex-wrap gap-2 mb-4">
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
            <p class="text-sm text-text-light mb-4">등록된 태그가 없습니다.</p>
          {/if}

          <!-- Post Info -->
          <div class="mb-6 p-3 bg-bg rounded-lg">
            <div class="flex justify-between text-xs text-text-light mb-1">
              <span>작성자</span>
              <span>{post.inpUser || '-'}</span>
            </div>
            <div class="flex justify-between text-xs text-text-light mb-1">
              <span>작성일</span>
              <span>{post.inpDttm ? new Date(post.inpDttm).toLocaleDateString('ko-KR') : '-'}</span>
            </div>
            <div class="flex justify-between text-xs text-text-light">
              <span>수정일</span>
              <span>{post.updDttm ? new Date(post.updDttm).toLocaleDateString('ko-KR') : '-'}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              class="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm
                hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? '수정 중...' : '수정'}
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
{:else}
  <div class="text-center py-12">
    <p class="text-text-light text-lg">게시물을 찾을 수 없습니다.</p>
    <a href="/admin/posts" class="text-primary hover:text-primary-dark mt-4 inline-block">목록으로 돌아가기</a>
  </div>
{/if}
