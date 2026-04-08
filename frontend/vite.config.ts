import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT || 5173);
  const apiBase = env.VITE_API_BASE_URL || '/api';
  const target = env.VITE_BASE_TARGET_URL || 'http://localhost:8888';

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        [apiBase]: {
          target,
          changeOrigin: true,
          rewrite: requestPath => {
            if (!requestPath.startsWith(apiBase)) {
              return requestPath;
            }

            const rewrittenPath = requestPath.slice(apiBase.length);
            return rewrittenPath.length > 0 ? rewrittenPath : '/';
          },
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});
