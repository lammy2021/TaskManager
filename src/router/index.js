import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import TaskPage from '../components/TaskPage.vue';
import Cookies from 'js-cookie';

const routes = [
  { path: '/', component: MainPage },
  { path: '/task-page', component: TaskPage },
  { path: '/login', component: () => import('../components/AdminLoginPage.vue') },
  {
    path: '/admin',
    component: () => import('../components/AdminDashboardPage.vue'), // Lazy load the component
    children: [
      { path: 'dashboard', component: () => import('../components/AdminDashboard.vue') },
      { path: 'add-collection', component: () => import('../components/AddCollection.vue') },
      { path: 'collection-management', component: () => import('../components/CollectionManagement.vue') },
      { path: 'user-management', component: () => import('../components/UserManagement.vue') },
      { path: 'system-settings', component: () => import('../components/SystemSettings.vue') },
    ],
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('jwt_token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;