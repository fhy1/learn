import Vue from 'vue'
import MyRouter from '../my-router/my-router'
// import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(MyRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new MyRouter({
  routes
})

export default router
