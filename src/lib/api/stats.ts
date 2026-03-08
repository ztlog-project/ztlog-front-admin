import { api } from './client';
import { ApiResponse } from './types';

export interface ViewRankingItem {
  ctntNo: number;
  title: string;
  totalViewCnt?: number;
  todayViewCnt?: number;
  viewCnt?: number;
  [key: string]: any;
}

export interface DailyGrowthItem {
  statDate?: string;
  baseDate?: string;
  viewCnt?: number;
  commentCnt?: number;
  totalViewCnt?: number;
  totalCommentCnt?: number;
  [key: string]: any;
}

export interface CommentStatsItem {
  ctntNo?: number;
  title?: string;
  commentCnt?: number;
  totalCommentCnt?: number;
  [key: string]: any;
}

export const statsApi = {
  getViewRanking: (): Promise<ApiResponse<any>> =>
    api.get('/v1/stats/views/ranking'),

  getDailyGrowth: (startDate: string, endDate: string): Promise<ApiResponse<any>> =>
    api.get('/v1/stats/daily-growth', { startDate, endDate }),

  getCurrentComments: (): Promise<ApiResponse<any>> =>
    api.get('/v1/stats/comments/current'),

  syncTotalViews: (): Promise<any> =>
    api.post('/v1/stats/views/total', {}),

  collectViewRawLogs: (startDate: string, endDate: string): Promise<any> =>
    api.post('/v1/stats/views/raw', { startDate, endDate }),

  collectDailyStats: (): Promise<any> =>
    api.post('/v1/stats/daily', {}),

  syncCommentStats: (): Promise<any> =>
    api.post('/v1/stats/comments/sync', {}),
};
