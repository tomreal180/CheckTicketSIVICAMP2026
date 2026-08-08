import { createRouter, createWebHistory } from 'vue-router'
import ParticipantCheckInView from '../views/CheckIn/ParticipantCheckInView.vue'
import BtcManagementView from '../views/BTC/BtcManagementView.vue'
import StatisticsView from '../views/Statistics/StatisticsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/check-in'
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    component: ParticipantCheckInView
  },
  {
    path: '/btc',
    name: 'BTCManagement',
    component: BtcManagementView
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
