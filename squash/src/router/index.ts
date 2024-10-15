import { createRouter, createWebHistory } from 'vue-router'
import AgendaView from '@/views/AgendaView.vue'
import LoginView from '@/views/LoginView.vue'
import ExpensesView from '@/views/Finances/ExpensesView.vue'
import BudgetView from '@/views/Finances/BudgetView.vue'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: AgendaView
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView
    },
    {
      path: '/expenses/budget',
      name: 'expenses/budget',
      component: BudgetView
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router;
