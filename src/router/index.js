import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 正常写法
// import Login from '@/views/login'
const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载写法
    component: () => import('@/views/login')
    // 正常写法
    // component : Login
  },
  {
    path: '/',
    // name: 'layout', // 如果父路由有默认子路由，那么它的 name 没有意义
    // 路由懒加载写法
    component: () => import('@/views/layout'),
    // 正常写法
    // component : Login
    children: [
      {
        path: '', // 默认子路由,只能有1个
        name: 'home',
        // 路由懒加载写法
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        // 路由懒加载写法
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        // 路由懒加载写法
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        // 路由懒加载写法
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }
]

const router = new VueRouter({
  routes
})

export default router
