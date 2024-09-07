// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import TaskPage from '../components/TaskPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/task-page', component: TaskPage },
  {
    path: '/admin',
    component: ()=> import('../components/AdminDashboardPage.vue'), // Lazy load the component
    children: [
      { path: 'dashboard', component: ()=> import('../components/AdminDashboard.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router