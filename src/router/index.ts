import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/check-in'
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    component: () => import('../views/CheckIn/ParticipantCheckInView.vue')
  },
  {
    path: '/btc',
    name: 'BTCManagement',
    component: () => import('../views/BTC/BtcManagementView.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics/StatisticsView.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
