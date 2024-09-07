// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import TaskPage from '../components/TaskPage.vue'
import AdminDashboardPage from '../components/AdminDashboardPage.vue'
import AdminDashboard from '../components/AdminDashboard.vue' // Import the renamed component

const routes = [
  { path: '/', component: Main },
  { path: '/task-page', component: TaskPage },
  {
    path: '/admin',
    component: AdminDashboardPage,
    children: [
      { path: 'dashboard', component: AdminDashboard } // Use the renamed component
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router