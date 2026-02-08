import { api } from './client.js';

export const contentsApi = {
  getList: (page = 1) =>
    api.get('/v1/contents', { no: page }),

  getDetail: (ctntNo) =>
    api.get(`/v1/contents/${ctntNo}`),

  create: (data) =>
    api.post('/v1/contents', data),

  update: (data) =>
    api.put('/v1/contents', data),

  delete: (ctntNo) =>
    api.delete(`/v1/contents/${ctntNo}`)
};
