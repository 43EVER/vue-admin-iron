import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main.vue'
import DataList from '../views/DataList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      { path: '/datalist', component: DataList },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
