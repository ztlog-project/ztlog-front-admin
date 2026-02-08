import { browser } from '$app/environment';
import { auth } from '$lib/stores/auth.js';
import { goto } from '$app/navigation';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/admin/api';

function getToken() {
  if (!browser) return null;
  return localStorage.getItem('accessToken') || null;
}

export async function apiClient(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 401) {
    auth.logout();
    if (browser) goto('/login');
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API 오류 (${response.status})`);
  }

  return response.json();
}

export const api = {
  get: (endpoint, params) => {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return apiClient(url);
  },
  post: (endpoint, data) =>
    apiClient(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) =>
    apiClient(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) =>
    apiClient(endpoint, { method: 'DELETE' })
};
