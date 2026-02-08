<script>
  import { onMount } from 'svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { dashboardApi } from '$lib/api/dashboard.js';
  import { contentsApi } from '$lib/api/contents.js';
  import { tagsApi } from '$lib/api/tags.js';

  let stats = { totalPosts: 0, totalTags: 0, totalViews: 0, totalComments: 0 };
  let recentPosts = [];
  let tags = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const [mainRes, contentsRes, tagsRes] = await Promise.all([
        dashboardApi.getMain(),
        contentsApi.getList(1),
        tagsApi.getList(1)
      ]);

      if (mainRes.data) {
        stats = {
          totalPosts: mainRes.data.totalPosts ?? mainRes.data.contentCount ?? 0,
          totalTags: mainRes.data.totalTags ?? mainRes.data.tagCount ?? 0,
          totalViews: mainRes.data.totalViews ?? 0,
          totalComments: mainRes.data.totalComments ?? 0
        };
      }

      if (contentsRes.data) {
        const list = contentsRes.data.list || contentsRes.data;
        recentPosts = Array.isArray(list) ? list.slice(0, 5) : [];
      }

      if (tagsRes.list) {
        tags = tagsRes.list;
      } else if (tagsRes.data?.list) {
        tags = tagsRes.data.list;
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>대시보드 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6">
  <h1 class="text-2xl font-bold text-text">대시보드</h1>
  <p class="text-sm text-text-light mt-1">블로그 현황을 한눈에 확인하세요</p>
</div>

{#if loading}
  <div class="flex items-center justify-center py-20">
    <div class="text-text-light">로딩 중...</div>
  </div>
{:else if error}
  <div class="p-4 bg-danger/10 text-danger text-sm rounded-lg mb-6">{error}</div>
{:else}
  <!-- Stat Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <StatCard title="총 게시물" value={stats.totalPosts} icon="article" color="primary" change="" />
    <StatCard title="태그" value={stats.totalTags} icon="category" color="success" change="" />
    <StatCard title="총 조회수" value={stats.totalViews} icon="eye" color="info" change="" />
    <StatCard title="댓글" value={stats.totalComments} icon="comment" color="warning" change="" />
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Recent Posts -->
    <div class="xl:col-span-2 bg-card rounded-lg shadow-sm border border-border">
      <div class="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text">최근 게시물</h2>
        <a href="/admin/posts" class="text-sm text-primary hover:text-primary-dark transition-colors">전체보기</a>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">제목</th>
              <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">작성자</th>
              <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">작성일</th>
            </tr>
          </thead>
          <tbody>
            {#each recentPosts as post}
              <tr class="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
                <td class="px-6 py-3.5">
                  <a href="/admin/posts/{post.ctntNo}" class="text-sm text-text hover:text-primary transition-colors font-medium">{post.title}</a>
                </td>
                <td class="px-6 py-3.5">
                  <span class="text-sm text-text-light">{post.inpUser || '-'}</span>
                </td>
                <td class="px-6 py-3.5">
                  <span class="text-sm text-text-light">{post.inpDttm ? new Date(post.inpDttm).toLocaleDateString('ko-KR') : '-'}</span>
                </td>
              </tr>
            {/each}
            {#if recentPosts.length === 0}
              <tr>
                <td colspan="3" class="px-6 py-8 text-center text-text-light text-sm">게시물이 없습니다.</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tag List -->
    <div class="bg-card rounded-lg shadow-sm border border-border">
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-lg font-semibold text-text">태그 목록</h2>
      </div>
      <div class="p-6">
        {#if tags.length > 0}
          <ul class="space-y-4">
            {#each tags as tag}
              <li class="flex items-center justify-between">
                <span class="text-sm text-text">{tag.tagName}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {tag.contents?.length || 0}개 게시물
                </span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-sm text-text-light text-center">태그가 없습니다.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}
