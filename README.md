## 1. 初始化vite

1. 新建 Vue 3 + TypeScript + Vite

   ```shell
   npm init vite
   cd programe-path
   npm install
   npm run dev
   ```

2. `vite.config`设置别名 `@`

   ```typescript
   import { defineConfig, loadEnv } from 'vite'
   import vue from '@vitejs/plugin-vue'
   
   import { resolve } from 'path'
   const root = process.cwd()
   
   function pathResolve(dir) {
     return resolve(root, '.', dir)
   }
   
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [vue()],
     resolve: {
       extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
       alias: [
         {
           find: /\@\//,
           replacement: `${pathResolve('src')}/`
         }
       ]
     },
   })
   
   ```

3. 设置补全路径 `tsconfig.json`

   ``` typescript
   {
   	"compilerOptions":{
   			...
         "baseUrl": ".",
   			"paths": {
         	"@/*": ["src/*"]
         }
   	    ...
   	}
   }
   ```

---



## 2. 配置 scss 全局样式、主题

1. 安装sass及sass-loader

   ```
   npm install sass sass-loader -D
   ```

2. 安装 varlet 、UnoCSS

   ```
   # npm
   npm i @varlet/ui -S
   npm i @varlet/preset-unocss -D
   ```

   新建、配置 uno.config.ts

   ``` typescript
   import { presetVarlet } from '@varlet/preset-unocss'
   export default defineConfig({
     presets: [presetUno(), presetVarlet()]
   })
   ```

   配置 vi te.config.ts css、按需加载

   ```typescript
   import { defineConfig, loadEnv } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import components from 'unplugin-vue-components/vite'
   import autoImport from 'unplugin-auto-import/vite'
   import { VarletImportResolver } from '@varlet/import-resolver'
   
   import UnoCSS from 'unocss/vite'
   
   import { resolve } from 'path'
   const root = process.cwd()
   
   function pathResolve(dir) {
     return resolve(root, '.', dir)
   }
   
   // https://vitejs.dev/config/
   export default defineConfig({
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
   })
   
   ```

   修改 src/main.ts

   ```typescript
   import { createApp } from 'vue'
   import './styles/index.scss';
   import 'virtual:uno.css'
   
   import App from './App.vue'
   
   createApp(App).mount('#app')
   
   ```

3. 桌面端适配 按照官方文档

   ```
   # npm
   npm i @varlet/touch-emulator
   
   ```

   ```
   import '@varlet/touch-emulator'
   ```

4. 覆盖主题配置

   ```
   	// scss
   	src/styles/index.scss
     src/styles/main.scss
     src/styles/var.scss
     src/styles/reset.scss
     
     // theme
     src/theme/themeStyleProvider.ts
     src/theme/themeVars.ts
   ```



## 3. 状态管理 Pinia

```
npm install pinia
```

Src/store/index.ts

```
import { createPinia } from "pinia";

import type { App } from "vue";

const store = createPinia();

export const setupStore = (app: App<Element>) => {
    app.use(store)
};

export default setupStore;
```





## 4. 持久化

```
npm install web-storage-cache --save-dev
```

src/hooks/useCache.ts

```typescript
// useCache.ts
import { ref } from 'vue';

/**
 * 自定义 Hook，用于使用 WebStorage（localStorage 或 sessionStorage）管理缓存。
 */
export function useCache(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
  // 可选：用于追踪缓存状态的 ref（根据需求决定是否使用）
  const cache = ref<{ [key: string]: any }>({});

  // 获取对应存储的 helper 方法（localStorage 或 sessionStorage）
  const getStorage = () => (storageType === 'localStorage' ? localStorage : sessionStorage);

  /**
   * 将数据存储到指定的 WebStorage（localStorage 或 sessionStorage）中。
   * @param key - 存储的键名
   * @param value - 存储的值
   */
  const set = (key: string, value: any): void => {
    try {
      const storage = getStorage();
      storage.setItem(key, JSON.stringify(value));
      cache.value[key] = value; // 可选：更新 ref 中的缓存状态以保持响应性
    } catch (error) {
      console.error('设置缓存时出错:', error);
    }
  };

  /**
   * 从指定的 WebStorage（localStorage 或 sessionStorage）中获取数据。
   * @param key - 获取的键名
   * @returns 存储的值，如果没有找到则返回 null
   */
  const get = <T>(key: string): T | null => {
    try {
      const storage = getStorage();
      const storedValue = storage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      return null;
    } catch (error) {
      console.error('获取缓存时出错:', error);
      return null;
    }
  };

  /**
   * 从指定的 WebStorage（localStorage 或 sessionStorage）中移除某个项。
   * @param key - 要移除的键名
   */
  const remove = (key: string): void => {
    try {
      const storage = getStorage();
      storage.removeItem(key);
      delete cache.value[key]; // 可选：更新 ref 中的缓存状态
    } catch (error) {
      console.error('移除缓存时出错:', error);
    }
  };

  /**
   * 清空指定的 WebStorage（localStorage 或 sessionStorage）中的所有数据。
   */
  const clear = (): void => {
    try {
      const storage = getStorage();
      storage.clear();
      cache.value = {}; // 可选：重置缓存状态
    } catch (error) {
      console.error('清空缓存时出错:', error);
    }
  };

  return { set, get, remove, clear, cache };
}
```



## 5. 配置 vue-router4

```
npm install vue-router@4
```

1. 环境变量文件`.env.production`，`.env.development`

   .env.production

   ```
   // 环境
   NODE_ENV=production
   # 接口前缀
   VITE_API_BASEPATH='pro'
   # 打包路径
   VITE_BASE_PATH='./'
   
   ```

   `.env.development`

   ```
   // 环境
   NODE_ENV=development
   # 接口前缀
   VITE_API_BASEPATH='dev'
   # 打包路径
   VITE_BASE_PATH='/'
   
   ```

2. Src/router/index.ts

   ```typescript
   import { createRouter, createWebHistory, RouteRecordRaw,createWebHashHistory} from 'vue-router'
   import type { App } from 'vue'
   type RouterCustorm={
       hidden?:boolean
   }
   export const constantRouterMap: (RouteRecordRaw | RouterCustorm)[] = [
       {
           path: '/login',
           name: 'Login',
           hidden: true,
           component: () => import('@/views/login/index.vue'),
       }
   ]
   const router = createRouter({
       history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
       routes: constantRouterMap as RouteRecordRaw[],
       scrollBehavior: () => ({ left: 0, top: 0 })
   })
   
   export const setupRouter = (app: App<Element>) => {
       app.use(router)
   }
   
   ```

   

# 6. 配置 axios 请求

上面已经完善环境变量 `.env.production` `.env.developent`

`npm install axios`

1. 新增配置文件  `src/service/config.ts`

   ```ts
   const config: {
     base_url: {
       dev: string
       pro: string
     }
     result_code: number | string
     default_headers: AxiosHeaders;
     request_timeout: number
   } = {
     /**
      * api请求基础路径
      */
     base_url: {
       // 开发环境接口前缀
       dev: '/api',
   
       // 打包生产环境接口前缀
       pro: 'https://xxxx/api',
     },
   
     /**
      * 接口成功返回状态码
      */
     result_code: '0000',
   
     /**
      * 接口请求超时时间
      */
     request_timeout: 60000,
   
     /**
      * 默认接口请求类型
      * 可选值：application/x-www-form-urlencoded multipart/form-data
      */
     default_headers: 'application/json'
   }
   
   export { config }
   ```

2. 同样目录新增 `service.ts`

   ```ts
   import axios, {
     AxiosInstance,
     AxiosRequestConfig,
     AxiosRequestHeaders,
     AxiosResponse,
     AxiosError
   } from 'axios'
   
   // @ts-ignore
   import qs from 'qs'
   
   import { config } from './config'
   
   import { ElMessage } from 'element-plus'
   
   const { result_code, base_url } = config
   // export const PATH_URL ='/api'
   // @ts-ignore
   export const PATH_URL = base_url[import.meta.env.VITE_API_BASEPATH]
   // 创建axios实例
   const service: AxiosInstance = axios.create({
     baseURL: PATH_URL, // api 的 base_url
     timeout: config.request_timeout // 请求超时时间
   })
   
   // request拦截器
   service.interceptors.request.use(
     (config: AxiosRequestConfig) => {
       if (
         config.method === 'post' &&
         (config.headers as AxiosRequestHeaders)['Content-Type'] ===
           'application/x-www-form-urlencoded'
       ) {
         config.data = qs.stringify(config.data)
       }
       // ;(config.headers as AxiosRequestHeaders)['Token'] = 'test test'
       // get参数编码
       if (config.method === 'get' && config.params) {
         let url = config.url as string
         url += '?'
         const keys = Object.keys(config.params)
         for (const key of keys) {
           if (config.params[key] !== void 0 && config.params[key] !== null) {
             url += `${key}=${encodeURIComponent(config.params[key])}&`
           }
         }
         url = url.substring(0, url.length - 1)
         config.params = {}
         config.url = url
       }
       return config
     },
     (error: AxiosError) => {
       // Do something with request error
       console.log(error) // for debug
       Promise.reject(error)
     }
   )
   
   // response 拦截器
   service.interceptors.response.use(
     (response: AxiosResponse<any>) => {
       if (response.config.responseType === 'blob') {
         // 如果是文件流，直接过
         return response
       } else if (response.data.code === result_code) {
         return response.data
       } else {
         ElMessage.error(response.data.message)
       }
     },
     (error: AxiosError) => {
       console.log('err' + error) // for debug
       ElMessage.error(error.message)
       return Promise.reject(error)
     }
   )
   
   export { service }
   
   ```

3. 同目录新增 index.ts 导出：

   ```ts
   import { service } from './service'
   
   import { config } from './config'
   
   const { default_headers } = config
   
   const request = (option: any) => {
     const { url, method, params, data, headersType, responseType } = option
     return service({
       url: url,
       method,
       params,
       data,
       responseType: responseType,
       headers: {
         'Content-Type': headersType || default_headers
       }
     })
   }
   export default {
     get: <T = any>(option: any) => {
       return request({ method: 'get', ...option }) as unknown as T
     },
     post: <T = any>(option: any) => {
       return request({ method: 'post', ...option }) as unknown as T
     },
     delete: <T = any>(option: any) => {
       return request({ method: 'delete', ...option }) as unknown as T
     },
     put: <T = any>(option: any) => {
       return request({ method: 'put', ...option }) as unknown as T
     }
   }
   
   ```

4. 请求地址统一维护`src/api/` 以下接口测试：

   1. 新建 src/api/login/index.ts

      ```ts
      import request from '@/render/service/axios'
      import type { UserType } from './types'
      export const loginApi = (data: Partial<UserType>): Promise<IResponse<UserType>> => {
          return request.post({ url: '/auth/manage/login/pwd', data })
      }
      
      ```

   2. 新建 types.ts

      ```ts
      export type UserLoginType = {
          username: string
          password: string
      }
      
      export type UserType = {
          username: string
          password: string
          role: string
          roleId: string
          permissions: string | string[]
      }
      
      ```

   3. vite.config.ts 配置代理

      ```ts
      import { defineConfig, loadEnv } from 'vite'
      import vue from '@vitejs/plugin-vue'
      import components from 'unplugin-vue-components/vite'
      import autoImport from 'unplugin-auto-import/vite'
      import { VarletImportResolver } from '@varlet/import-resolver'
      
      import UnoCSS from 'unocss/vite'
      
      import { resolve } from 'path'
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
      ```

   4. 设置全局 types `/types/global.global.d.ts`

      ```ts
      export {}
      declare global {
          interface Window {
              electronAPI?: any;//全局变量名
          }
           interface AxiosConfig {
              params?: any
              data?: any
              url?: string
              method?: AxiosMethod
              headersType?: string
              responseType?: AxiosResponseType
          }
      
           interface IResponse<T = any> {
              code: string
              data: T extends any ? T : T & any
          }
          type AxiosHeaders =
              | 'application/json'
              | 'application/x-www-form-urlencoded'
              | 'multipart/form-data'
      }
      declare const window: any;
      
      ```

   # 7. 本地 mock

   

   # 8. 接口配置测试是否生效

   
