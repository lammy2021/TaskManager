import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import TaskPage from '../components/TaskPage.vue' // Import the new component

const routes = [
  { path: '/', component: Main },
  { path: '/task-page', component: TaskPage},
  { path: '/admin', component: () => import('../components/AdminDashboardPage.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router