<script>
  import { onMount } from 'svelte';
  import { tagsApi } from '$lib/api/tags.js';

  let tagList = [];
  let newName = '';
  let editingId = null;
  let editName = '';
  let loading = true;
  let error = '';
  let saving = false;

  async function loadTags() {
    loading = true;
    error = '';
    try {
      const res = await tagsApi.getList(1);
      if (res.list) {
        tagList = res.list;
      } else if (res.data?.list) {
        tagList = res.data.list;
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(loadTags);

  async function addTag() {
    if (!newName.trim()) return;
    saving = true;
    try {
      await tagsApi.create({ tagName: newName.trim() });
      newName = '';
      await loadTags();
    } catch (e) {
      alert('태그 추가 실패: ' + e.message);
    } finally {
      saving = false;
    }
  }

  function startEdit(tag) {
    editingId = tag.tagNo;
    editName = tag.tagName;
  }

  async function saveEdit(tagNo) {
    if (!editName.trim()) return;
    saving = true;
    try {
      await tagsApi.update({ tagNo, tagName: editName.trim() });
      editingId = null;
      await loadTags();
    } catch (e) {
      alert('태그 수정 실패: ' + e.message);
    } finally {
      saving = false;
    }
  }

  function cancelEdit() {
    editingId = null;
  }

  async function deleteTag(tagNo) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await tagsApi.delete(tagNo);
      await loadTags();
    } catch (e) {
      alert('태그 삭제 실패: ' + e.message);
    }
  }
</script>

<svelte:head>
  <title>태그 관리 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6">
  <h1 class="text-2xl font-bold text-text">태그 관리</h1>
  <p class="text-sm text-text-light mt-1">블로그 태그를 추가, 수정, 삭제합니다</p>
</div>

<!-- Add Tag -->
<div class="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
  <h2 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">새 태그 추가</h2>
  <form on:submit|preventDefault={addTag} class="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      bind:value={newName}
      placeholder="태그 이름 (최대 15자)"
      maxlength="15"
      required
      disabled={saving}
      class="px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white flex-1
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
        disabled:opacity-50"
    />
    <button
      type="submit"
      disabled={saving}
      class="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium
        hover:bg-primary-dark transition-colors flex-shrink-0 inline-flex items-center gap-2
        disabled:opacity-50"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      추가
    </button>
  </form>
</div>

{#if loading}
  <div class="flex items-center justify-center py-20">
    <div class="text-text-light">로딩 중...</div>
  </div>
{:else if error}
  <div class="p-4 bg-danger/10 text-danger text-sm rounded-lg">{error}</div>
{:else}
  <!-- Tag List -->
  <div class="bg-card rounded-lg shadow-sm border border-border">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-10">#</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">이름</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-24">게시물 수</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">생성일</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-28">액션</th>
          </tr>
        </thead>
        <tbody>
          {#each tagList as tag, i}
            <tr class="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
              <td class="px-6 py-3.5 text-sm text-text-light">{i + 1}</td>
              <td class="px-6 py-3.5">
                {#if editingId === tag.tagNo}
                  <input
                    type="text"
                    bind:value={editName}
                    maxlength="15"
                    class="px-3 py-1.5 border border-primary rounded text-sm text-text bg-white w-full
                      focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                {:else}
                  <span class="text-sm text-text font-medium">{tag.tagName}</span>
                {/if}
              </td>
              <td class="px-6 py-3.5">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {tag.contents?.length || 0}
                </span>
              </td>
              <td class="px-6 py-3.5 text-sm text-text-light">
                {tag.inpDttm ? new Date(tag.inpDttm).toLocaleDateString('ko-KR') : '-'}
              </td>
              <td class="px-6 py-3.5">
                <div class="flex items-center gap-2">
                  {#if editingId === tag.tagNo}
                    <button
                      on:click={() => saveEdit(tag.tagNo)}
                      disabled={saving}
                      class="p-1.5 text-success hover:bg-success/10 transition-colors rounded-lg disabled:opacity-50"
                      title="저장"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      on:click={cancelEdit}
                      class="p-1.5 text-text-light hover:bg-bg transition-colors rounded-lg"
                      title="취소"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  {:else}
                    <button
                      on:click={() => startEdit(tag)}
                      class="p-1.5 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                      title="수정"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      on:click={() => deleteTag(tag.tagNo)}
                      class="p-1.5 text-text-light hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
                      title="삭제"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if tagList.length === 0}
      <div class="p-12 text-center">
        <p class="text-text-light">등록된 태그가 없습니다.</p>
      </div>
    {/if}
  </div>
{/if}
