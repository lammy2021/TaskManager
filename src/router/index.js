import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import TaskPage from '../components/TaskPage.vue' // Import the new component

const routes = [
  { path: '/', component: Main },
  { path: '/task-page', component: TaskPage} // Add the new route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router