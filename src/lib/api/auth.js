import { api } from './client.js';

export const authApi = {
  login: (userId, password) =>
    api.post('/v1/user/login', { userId, password }),

  logout: () =>
    api.post('/v1/user/logout'),

  signup: (username, password) =>
    api.post('/v1/user/signup', { username, password }),

  withdraw: () =>
    api.delete('/v1/user/withdraw')
};
