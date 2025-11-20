import { createRouter, createWebHistory } from 'vue-router'

const ListView = () => import('../views/ListView.vue')
const DetailView = () => import('../views/DetailView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const ConfirmView = () => import('../views/ConfirmView.vue')
const ResultsView = () => import('../views/ResultsView.vue')
const LoadingView = () => import('../views/LoadingView.vue')

const routes = [
  { path: '/', name: 'Home', component: ListView },
  { path: '/project/:id', name: 'ProjectDetail', component: DetailView, props: true },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/confirm', name: 'Confirm', component: ConfirmView },
  { path: '/results', name: 'Results', component: ResultsView },
  { path: '/loading', name: 'Loading', component: LoadingView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router