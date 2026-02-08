import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const stored = browser ? localStorage.getItem('accessToken') : null;
  const { subscribe, set } = writable(stored);

  return {
    subscribe,
    login(tokenInfo) {
      const token = tokenInfo.accessToken;
      set(token);
      if (browser) localStorage.setItem('accessToken', token);
    },
    logout() {
      set(null);
      if (browser) localStorage.removeItem('accessToken');
    }
  };
}

export const auth = createAuthStore();
