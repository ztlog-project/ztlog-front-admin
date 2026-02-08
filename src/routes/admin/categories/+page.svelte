<script>
  import { categories as initialCategories } from '$lib/data/mock.js';

  let categoryList = [...initialCategories];
  let newName = '';
  let newDescription = '';
  let editingId = null;
  let editName = '';
  let editDescription = '';

  function addCategory() {
    if (!newName.trim()) return;
    const newId = Math.max(...categoryList.map(c => c.id)) + 1;
    categoryList = [...categoryList, {
      id: newId,
      name: newName.trim(),
      description: newDescription.trim(),
      postCount: 0
    }];
    newName = '';
    newDescription = '';
  }

  function startEdit(cat) {
    editingId = cat.id;
    editName = cat.name;
    editDescription = cat.description;
  }

  function saveEdit(id) {
    categoryList = categoryList.map(c =>
      c.id === id ? { ...c, name: editName.trim(), description: editDescription.trim() } : c
    );
    editingId = null;
  }

  function cancelEdit() {
    editingId = null;
  }

  function deleteCategory(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
      categoryList = categoryList.filter(c => c.id !== id);
    }
  }
</script>

<svelte:head>
  <title>카테고리 관리 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6">
  <h1 class="text-2xl font-bold text-text">카테고리 관리</h1>
  <p class="text-sm text-text-light mt-1">블로그 카테고리를 추가, 수정, 삭제합니다</p>
</div>

<!-- Add Category -->
<div class="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
  <h2 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">새 카테고리 추가</h2>
  <form on:submit|preventDefault={addCategory} class="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      bind:value={newName}
      placeholder="카테고리 이름"
      required
      class="px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white flex-shrink-0 sm:w-48
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
    <input
      type="text"
      bind:value={newDescription}
      placeholder="설명 (선택사항)"
      class="px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white flex-1
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
    <button
      type="submit"
      class="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium
        hover:bg-primary-dark transition-colors flex-shrink-0 inline-flex items-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      추가
    </button>
  </form>
</div>

<!-- Category List -->
<div class="bg-card rounded-lg shadow-sm border border-border">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-border">
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-10">#</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">이름</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">설명</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-24">게시물 수</th>
          <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-28">액션</th>
        </tr>
      </thead>
      <tbody>
        {#each categoryList as cat, i}
          <tr class="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
            <td class="px-6 py-3.5 text-sm text-text-light">{i + 1}</td>
            <td class="px-6 py-3.5">
              {#if editingId === cat.id}
                <input
                  type="text"
                  bind:value={editName}
                  class="px-3 py-1.5 border border-primary rounded text-sm text-text bg-white w-full
                    focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              {:else}
                <span class="text-sm text-text font-medium">{cat.name}</span>
              {/if}
            </td>
            <td class="px-6 py-3.5">
              {#if editingId === cat.id}
                <input
                  type="text"
                  bind:value={editDescription}
                  class="px-3 py-1.5 border border-primary rounded text-sm text-text bg-white w-full
                    focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              {:else}
                <span class="text-sm text-text-light">{cat.description}</span>
              {/if}
            </td>
            <td class="px-6 py-3.5">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {cat.postCount}
              </span>
            </td>
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-2">
                {#if editingId === cat.id}
                  <button
                    on:click={() => saveEdit(cat.id)}
                    class="p-1.5 text-success hover:bg-success/10 transition-colors rounded-lg"
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
                    on:click={() => startEdit(cat)}
                    class="p-1.5 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                    title="수정"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    on:click={() => deleteCategory(cat.id)}
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

  {#if categoryList.length === 0}
    <div class="p-12 text-center">
      <p class="text-text-light">등록된 카테고리가 없습니다.</p>
    </div>
  {/if}
</div>
