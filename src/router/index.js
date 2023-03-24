import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 正常写法
// import Login from '@/views/login'
const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    // 路由懒加载写法
    component: () => import('@/views/login')
    // 正常写法
    // component : Login
  }
]

const router = new VueRouter({
  routes
})

export default router
