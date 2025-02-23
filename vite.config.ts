import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // "@/..."를 "./src/..."로 매핑
    },
  },
  base: '/', // Vercel에서 SPA 라우팅을 올바르게 처리하도록 추가
});