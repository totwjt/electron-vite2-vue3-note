import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
    AxiosError
} from 'axios'

// @ts-ignore
import qs from 'qs'

import { config } from './config'

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
// 修改拦截器的参数类型

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (
            config.method === 'post' &&
            config.headers?.['Content-Type'] === 'application/x-www-form-urlencoded'
        ) {
            config.data = qs.stringify(config.data);
        }

        // 处理 GET 请求参数
        if (config.method === 'get' && config.params) {
            let url = config.url as string;
            url += '?';
            const keys = Object.keys(config.params);
            for (const key of keys) {
                if (config.params[key] !== void 0 && config.params[key] !== null) {
                    url += `${key}=${encodeURIComponent(config.params[key])}&`;
                }
            }
            url = url.substring(0, url.length - 1);
            config.params = {};
            config.url = url;
        }

        return config;
    },
    (error: AxiosError) => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        if (response.config.responseType === 'blob') {
            // 如果是文件流，直接过
            return response
        } else if (response.data.code === result_code) {
            return response.data
        } else {
            // ElMessage.error(response.data.message)
        }
    },
    (error: AxiosError) => {
        console.log('err' + error) // for debug
        //   ElMessage.error(error.message)
        return Promise.reject(error)
    }
)

export { service }
