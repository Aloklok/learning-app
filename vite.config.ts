import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // @ts-expect-error 因为我们锁定了依赖版本，Vite 的类型定义文件可能过时
    https: false,
    host: 'localhost',
    port: 5173,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    electron([
      {
        // 【改动 1】开发模式的入口指向新的、简单的 electron.dev.ts
        entry: 'electron.dev.ts',
        // 【改动 2】确保 onstart 钩子存在并启动 Electron
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            outDir: 'dist',
            rollupOptions: {
              // 【改动 3】明确指定生产构建的入口是 electron/main.ts
              input: 'electron/main.ts',
              external: [
                'electron',
                'better-sqlite3',
                'bindings',
                'speech_recognizer',
                /^node:.*/,
              ],
            },
          },
        },
      },
      {
        // preload 脚本的配置保持不变
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            outDir: 'dist',
            lib: {
              entry: 'electron/preload.ts',
              formats: ['cjs'],
              fileName: 'preload',
            },
            minify: false,
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@mk_components': path.resolve(__dirname, 'src/material/components'),
      '@mk_assets': path.resolve(__dirname, 'src/material/assets'),
      '@mk_examples': path.resolve(__dirname, 'src/material/examples'),
    },
  },
})