import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Search from '@/components/Search'
import VueResource from 'vue-resource'

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
    }
  ]
})
