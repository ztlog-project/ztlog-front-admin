export const categories = [
  { id: 1, name: '기술', description: '프로그래밍 및 기술 관련 글', postCount: 8 },
  { id: 2, name: '일상', description: '일상생활 이야기', postCount: 5 },
  { id: 3, name: '여행', description: '여행 후기 및 팁', postCount: 3 },
  { id: 4, name: '리뷰', description: '제품 및 서비스 리뷰', postCount: 4 },
  { id: 5, name: '튜토리얼', description: '단계별 가이드 및 강좌', postCount: 6 }
];

export const posts = [
  { id: 1, title: 'SvelteKit으로 블로그 만들기', category: '기술', status: 'published', date: '2025-01-15', views: 1240 },
  { id: 2, title: 'Tailwind CSS 실전 가이드', category: '튜토리얼', status: 'published', date: '2025-01-12', views: 980 },
  { id: 3, title: '2025년 웹 개발 트렌드', category: '기술', status: 'published', date: '2025-01-10', views: 2150 },
  { id: 4, title: '제주도 3박 4일 여행기', category: '여행', status: 'published', date: '2025-01-08', views: 760 },
  { id: 5, title: 'TypeScript 5.0 새로운 기능들', category: '기술', status: 'draft', date: '2025-01-06', views: 0 },
  { id: 6, title: '맥북 프로 M3 리뷰', category: '리뷰', status: 'published', date: '2025-01-04', views: 1890 },
  { id: 7, title: '커피 한 잔과 함께하는 아침', category: '일상', status: 'published', date: '2025-01-02', views: 340 },
  { id: 8, title: 'Docker 입문 가이드', category: '튜토리얼', status: 'published', date: '2024-12-28', views: 1560 },
  { id: 9, title: 'REST API 설계 원칙', category: '기술', status: 'published', date: '2024-12-25', views: 2340 },
  { id: 10, title: '오사카 맛집 탐방', category: '여행', status: 'draft', date: '2024-12-22', views: 0 },
  { id: 11, title: 'VS Code 필수 확장 프로그램', category: '기술', status: 'published', date: '2024-12-20', views: 3210 },
  { id: 12, title: 'Git 브랜치 전략', category: '튜토리얼', status: 'published', date: '2024-12-18', views: 1120 },
  { id: 13, title: '에어팟 프로 2 vs 소니 WF-1000XM5', category: '리뷰', status: 'published', date: '2024-12-15', views: 890 },
  { id: 14, title: '연말 회고: 2024년을 돌아보며', category: '일상', status: 'published', date: '2024-12-31', views: 560 },
  { id: 15, title: 'Svelte 5 Runes 완벽 정리', category: '튜토리얼', status: 'draft', date: '2025-01-16', views: 0 }
];

export const stats = {
  totalPosts: 15,
  totalCategories: 5,
  totalViews: 17040,
  totalComments: 234
};

export const recentActivity = [
  { type: 'post', message: '새 게시물 "SvelteKit으로 블로그 만들기" 발행', time: '5분 전' },
  { type: 'comment', message: '"REST API 설계 원칙"에 새 댓글', time: '12분 전' },
  { type: 'post', message: '"Tailwind CSS 실전 가이드" 수정됨', time: '1시간 전' },
  { type: 'comment', message: '"VS Code 필수 확장 프로그램"에 새 댓글', time: '2시간 전' },
  { type: 'category', message: '"튜토리얼" 카테고리 설명 수정', time: '3시간 전' }
];
