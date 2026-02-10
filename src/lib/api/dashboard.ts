import { api } from './client';
import { DashboardStats, ApiResponse } from './types';

export const dashboardApi = {
  getMain: (): Promise<ApiResponse<DashboardStats>> =>
    api.get('/v1/main')
};
