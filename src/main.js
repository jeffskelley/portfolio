import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Home from './components/PageHome';

const routes = [
  { path: '/', component: Home },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp()
app.use(router)
app.mount('#app')