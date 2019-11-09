import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main.vue'
import DataList from '../views/DataList.vue'
import DataEdit from '../views/DataEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      { path: '/data/list', component: DataList },
      { path: '/data/edit/:id', component: DataEdit, props: true },
      { path: '/data/edit', component: DataEdit, props: true },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
