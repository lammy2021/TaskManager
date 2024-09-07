// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import TaskPage from '../components/TaskPage.vue'
import AdminDashboardPage from '../components/AdminDashboardPage.vue'
import AdminDashboard from '../components/Dashboard.vue' // Import the new component

const routes = [
  { path: '/', component: Main },
  { path: '/task-page', component: TaskPage },
  {
    path: '/admin',
    component: AdminDashboardPage,
    children: [
      { path: 'dashboard', component: AdminDashboard } // Define the child route
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router