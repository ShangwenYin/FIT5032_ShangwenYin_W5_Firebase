import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 部署在仓库子路径下，需要设置 base（12.2 Step 2 的 Vite 版）
  base: process.env.NODE_ENV === 'production' ? '/FIT5032_ShangwenYin_W5_Firebase/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
