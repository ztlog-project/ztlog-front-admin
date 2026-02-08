import { api } from './client.js';

export const tagsApi = {
  getList: (page = 1) =>
    api.get('/v1/tags', { no: page }),

  getDetail: (tagNo) =>
    api.get(`/v1/tags/${tagNo}`),

  create: (data) =>
    api.post('/v1/tags', data),

  update: (data) =>
    api.put('/v1/tags', data),

  delete: (tagNo) =>
    api.delete(`/v1/tags/${tagNo}`)
};
