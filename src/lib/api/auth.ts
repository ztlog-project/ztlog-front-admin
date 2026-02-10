import { api } from './client';
import { LoginResponse, ApiResponse } from './types';

export const authApi = {
  login: (userId: string, password: string): Promise<ApiResponse<LoginResponse>> =>
    api.post('/v1/user/login', { userId, password }),

  logout: (): Promise<ApiResponse<void>> =>
    api.post('/v1/user/logout', {}),

  signup: (username: string, password: string): Promise<ApiResponse<void>> =>
    api.post('/v1/user/signup', { username, password }),

  withdraw: (): Promise<ApiResponse<void>> =>
    api.delete('/v1/user/withdraw')
};
