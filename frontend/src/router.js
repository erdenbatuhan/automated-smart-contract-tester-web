import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

import Home from '@/components/Home.vue';
import AuthForm from "@/components/AuthForm.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: AuthForm,
    meta: { requiresNoAuth: true },
    props: { actionText: 'Sign up', actionFunctionName: 'signup' }
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthForm,
    meta: { requiresNoAuth: true },
    props: { actionText: 'Log in', actionFunctionName: 'login' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to check authentication and authorization before each route navigation
router.beforeEach((to, from, next) => {
  const store = useStore();

  const isLoggedIn = store.getters['user/isLoggedIn']; // If the user is logged in
  const isLoggedInAsAdmin = store.getters['user/isLoggedInAsAdmin']; // If the user is logged in as an admin

  // Check if the route requires authentication
  if (to.meta['requiresAuth'] && !isLoggedIn) {
    return next('/login'); // Redirect to the login page if authentication is required and user is not logged in
  }

  // Check if the route requires no authentication and the user is already logged in
  if (to.meta['requiresNoAuth'] && isLoggedIn) {
    return next(from.fullPath); // Redirect back to the previous page
  }

  // Check if the route requires admin access
  if (to.meta['requiresAdmin'] && !isLoggedInAsAdmin) {
    return next(from.fullPath); // Redirect back to the previous page if the user is not an admin
  }

  // Allow access to the route
  next();
});

export default router;
