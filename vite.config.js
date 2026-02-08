import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [sveltekit(), tailwindcss()],
		server: {
			proxy: {
				'/admin/api/v1': {
					target: env.VITE_API_TARGET || 'http://localhost:8080',
					changeOrigin: true
				}
			}
		}
	};
});
