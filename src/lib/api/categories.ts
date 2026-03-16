import { api } from './client';
import { Category, ApiResponse } from './types';

export const categoriesApi = {
  getList: (): Promise<ApiResponse<Category[]>> =>
    api.get('/v1/categories'),

  create: (data: Omit<Category, 'cateNo' | 'categories'> & { cateNo?: number }): Promise<ApiResponse<Category>> =>
    api.post('/v1/categories', data),

  update: (data: Partial<Category>): Promise<ApiResponse<any>> =>
    api.put('/v1/categories', data),

  delete: (cateNo: number): Promise<ApiResponse<void>> =>
    api.delete(`/v1/categories/${cateNo}`)
};
