import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/compass',
    name: 'Compass',
    component: () => import('../views/Compass.vue')
  },
  {
    path: '/compass/free',
    name: 'CompassFree',
    component: () => import('../views/CompassFree.vue')
  },
  {
    path: '/compass/benchmark',
    name: 'CompassBenchmark',
    component: () => import('../views/CompassBenchmark.vue')
  },
  {
    path: '/ark',
    name: 'Ark',
    component: () => import('../views/Ark.vue')
  },
  {
    path: '/ark/quiz',
    name: 'ArkQuiz',
    component: () => import('../views/ArkQuiz.vue')
  },
  {
    path: '/ark/result',
    name: 'ArkResult',
    component: () => import('../views/ArkResult.vue')
  },
  {
    path: '/covenant',
    name: 'Covenant',
    component: () => import('../views/Covenant.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
