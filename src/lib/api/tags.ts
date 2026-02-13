import { api } from './client';
import { Tag, ApiResponse, PaginatedResponse } from './types';

export const tagsApi = {
  getList: (page: number = 1): Promise<ApiResponse<PaginatedResponse<Tag>>> =>
    api.get('/v1/tags', { page }),

  getDetail: (tagNo: number): Promise<ApiResponse<Tag>> =>
    api.get(`/v1/tags/${tagNo}`),

  create: (data: Partial<Tag>): Promise<ApiResponse<Tag>> =>
    api.post('/v1/tags', data),

  update: (data: Partial<Tag>): Promise<ApiResponse<Tag>> =>
    api.put('/v1/tags', data),

  delete: (tagNo: number): Promise<ApiResponse<void>> =>
    api.delete(`/v1/tags/${tagNo}`)
};
