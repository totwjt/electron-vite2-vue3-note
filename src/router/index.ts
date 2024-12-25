import { createRouter, createWebHistory, RouteRecordRaw,createWebHashHistory} from 'vue-router'
import type { App } from 'vue'
type RouterCustorm={
    hidden?:boolean
}
export const constantRouterMap: (RouteRecordRaw | RouterCustorm)[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/index.vue'),
    },
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

export default router

// export const setupRouter = (app: App<Element>) => {
//     app.use(router)
// }
