import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletImportResolver } from '@varlet/import-resolver'

import UnoCSS from 'unocss/vite'

// @ts-ignore
import { resolve } from 'path'
// @ts-ignore
const root = process.cwd()

// 路径解析函数
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default defineConfig(({ command, mode }) => {
  // 动态加载环境变量
  const env = loadEnv(mode, root)

  // 判断是否是构建阶段
  const isBuild = command === 'build'

  return {
    base: env.VITE_BASE_PATH || '/', // 根据环境变量动态设置 base 路径
    plugins: [
      vue(),
      UnoCSS(),
      components({
        resolvers: [VarletImportResolver()]
      }),
      autoImport({
        resolvers: [VarletImportResolver({ autoImport: true })]
      })
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    server: {
      port: Number(env.VITE_PORT) || 3000, // 从环境变量动态设置端口
      proxy: {
        // 配置代理，支持本地开发跨域
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      host: '0.0.0.0', // 允许局域网访问
      hmr: {
        overlay: false // 禁用 HMR 错误提示覆盖层
      }
    },
    build: {
      // 构建优化配置
      outDir: env.VITE_OUTPUT_DIR || 'dist', // 构建输出目录
      sourcemap: !isBuild // 开发阶段生成 source map
    }
  }
})