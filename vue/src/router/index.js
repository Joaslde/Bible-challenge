import { createRouter, createWebHistory } from 'vue-router'
import DayView from '../views/DayView.vue'
import HistoryView from '../views/HistoryView.vue'
import FormView from '../views/FormView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'day',
    component: DayView, // Vue du jour (par défaut)
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView, // Vue cumulée / progression
  },
  {
    path: '/log',
    name: 'log',
    component: FormView, // Formulaire de saisie (le bouton compteur)
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView, // Gestion des utilisateurs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router