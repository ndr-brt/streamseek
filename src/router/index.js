import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'

import Login from '@/components/Login'
import Search from '@/components/Search'
import NotFound from '@/components/NotFound'

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
  ]
})
