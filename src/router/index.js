import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/rent',
      name: 'rent',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RentView.vue'),
    },
    {
      path: '/sparring',
      name: 'sparring',
      component: () => import('../views/SparringView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/user/OrdersView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/OrdersView.vue'),
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
      }
    }
  },
})

router.beforeEach((to) => {
  if (to.path !== "/") {
    localStorage.setItem("lastRoute", to.path);
  } else {
    localStorage.removeItem("lastRoute");
  }

})

export default router
