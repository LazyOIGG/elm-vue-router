import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../views/Index.vue')
    },
    {
      path: '/businessList',
      name: 'businessList',
      component: () => import('../views/BusinessList.vue')
    },
    {
      path: '/businessInfo',
      name: 'businessInfo',
      component: () => import('../views/BusinessInfo.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/Orders.vue')
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/Payment.vue')
    },
    {
      path: '/userAddress',
      name: 'userAddress',
      component: () => import('../views/UserAddress.vue')
    },
    {
      path: '/addUserAddress',
      name: 'addUserAddress',
      component: () => import('../views/AddUserAddress.vue')
    },
    {
      path: '/editUserAddress',
      name: 'editUserAddress',
      component: () => import('../views/EditUserAddress.vue')
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: () => import('../views/OrderList.vue')
    }
  ]
})

export default router