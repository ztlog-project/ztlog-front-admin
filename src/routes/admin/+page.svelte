<script>
  import StatCard from '$lib/components/StatCard.svelte';
  import { stats, posts, categories, recentActivity } from '$lib/data/mock.js';

  const recentPosts = posts.slice(0, 5);
</script>

<svelte:head>
  <title>대시보드 - ZTLog Admin</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-6">
  <h1 class="text-2xl font-bold text-text">대시보드</h1>
  <p class="text-sm text-text-light mt-1">블로그 현황을 한눈에 확인하세요</p>
</div>

<!-- Stat Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
  <StatCard title="총 게시물" value={stats.totalPosts} icon="article" color="primary" change="+2 이번 주" />
  <StatCard title="카테고리" value={stats.totalCategories} icon="category" color="success" change="" />
  <StatCard title="총 조회수" value={stats.totalViews} icon="eye" color="info" change="+12.5% 지난주 대비" />
  <StatCard title="댓글" value={stats.totalComments} icon="comment" color="warning" change="+8 이번 주" />
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
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">카테고리</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">상태</th>
            <th class="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">조회수</th>
          </tr>
        </thead>
        <tbody>
          {#each recentPosts as post}
            <tr class="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
              <td class="px-6 py-3.5">
                <a href="/admin/posts/{post.id}" class="text-sm text-text hover:text-primary transition-colors font-medium">{post.title}</a>
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
              <td class="px-6 py-3.5">
                <span class="text-sm text-text-light">{post.views.toLocaleString()}</span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Right Sidebar Widgets -->
  <div class="space-y-6">
    <!-- Category Stats -->
    <div class="bg-card rounded-lg shadow-sm border border-border">
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-lg font-semibold text-text">카테고리별 게시물</h2>
      </div>
      <div class="p-6">
        <ul class="space-y-4">
          {#each categories as cat}
            <li class="flex items-center justify-between">
              <span class="text-sm text-text">{cat.name}</span>
              <div class="flex items-center gap-3">
                <div class="w-24 h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full"
                    style="width: {(cat.postCount / stats.totalPosts) * 100}%"
                  ></div>
                </div>
                <span class="text-sm text-text-light w-6 text-right">{cat.postCount}</span>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-card rounded-lg shadow-sm border border-border">
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-lg font-semibold text-text">최근 활동</h2>
      </div>
      <div class="p-6">
        <ul class="space-y-4">
          {#each recentActivity as activity}
            <li class="flex items-start gap-3">
              <div class="mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                {activity.type === 'post' ? 'bg-primary' : activity.type === 'comment' ? 'bg-success' : 'bg-warning'}"></div>
              <div>
                <p class="text-sm text-text">{activity.message}</p>
                <p class="text-xs text-text-light mt-0.5">{activity.time}</p>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
