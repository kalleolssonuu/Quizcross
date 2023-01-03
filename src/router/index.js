import { createRouter, createWebHashHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const routes = [
  {
    path: '/:lang',
    name: 'Start',
    component: StartView,
  },
  {
    path: '/',
    name: 'StartNoLang', //alternative default URL to load startView
    component: StartView,
  },

    {
    path: '/PreCreate/:lang',
    name: 'PreCreateView',
    component: () => import(/* webpackChunkName: "about" */ '../views/PreCreateView.vue')
  },

  {
    path: '/ActualPlay/:lang',
    name: 'ActualPlayView',
    component: () => import(/* webpackChunkName: "about" */ '../views/PlayView.vue')
  },

  {
    path: '/lobby/:lang',
    name: 'LobbyView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LobbyView.vue')
  },
  {
  path: '/CreateView/:lang',
  name: 'CreateCrosswordView',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/CreateView.vue')
  },
  {
    path: '/result/:id',
    name: 'ResultView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ResultView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
