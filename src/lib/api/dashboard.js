import { api } from './client.js';

export const dashboardApi = {
  getMain: () =>
    api.get('/v1/main')
};
