import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glslify from 'rollup-plugin-glslify'
import path from 'path'

const pathSrc = path.resolve(__dirname, './src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glslify()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: process.env.VITE_SERVER_PORT || 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @use "sass:list";
          @import "${pathSrc}/styles/global.scss";
        `,
      },
    },
  },
})
