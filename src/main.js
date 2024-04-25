import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/pages/LoginPage.vue'
import RegisterPage from './components/pages/RegisterPage.vue'
import DashboardPage from './components/pages/DashboardPage.vue'
import NotFound from './components/pages/errors/NotFound404.vue'
import AccountPage from './components/pages/AccountPage.vue'
axios.defaults.baseURL = 'https://backend-jwt.onrender.com/'
axios.interceptors.request.use(function (config) {
  return config
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/dashboard', component: DashboardPage },
    { path: '/account', component: AccountPage },

    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/:catchAll(.*)',
      redirect: '404'
    }
  ]
})

createApp(App).use(router).mount('#app')
