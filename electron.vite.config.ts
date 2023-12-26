import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    server: {
      proxy: {
        '/netease': {
          // target: 'http://127.0.0.1:3000',
          target: 'http://8.134.51.235/netease',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/netease/, '')
        },
        '/music': {
          // target: 'http://127.0.0.1:9000',
          target: 'http://8.134.51.235/music',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/music/, '')
        }
      }
    }
  }
})
