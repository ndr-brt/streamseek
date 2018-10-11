import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'

import Login from '@/components/login/Login'
import Search from '@/components/search/Search'
import NotFound from '@/components/notfound/NotFound'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/results/:page/:limit',
      name: 'Results',
      component: Search
    },
    {
      path: '*',
      name: 'Not Found',
      component: NotFound
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.name === 'Results') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ x: 0, y: 140 })
        }, 100)
      })
    }
  }
})
