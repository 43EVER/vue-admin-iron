import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main.vue'
import DataList from '../views/DataList.vue'
import DataEdit from '../views/DataEdit.vue'

import PrivilegeList from '../views/PrivilegeList.vue'
import PrivilegeEdit from '../views/PrivilegeEdit.vue'
import UserList from '../views/UserList.vue'
import UserEdit from '../views/UserEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      { path: '/data/list', component: DataList },
      { path: '/data/edit/:id', component: DataEdit, props: true },
      { path: '/data/edit', component: DataEdit },

      { path: '/privilege/list', component: PrivilegeList },
      { path: '/privilege/edit/:id', component: PrivilegeEdit, props: true },
      { path: '/privilege/edit', component: PrivilegeEdit },

      { path: '/user/list', component: UserList },
      { path: '/user/edit/:id', component: UserEdit, props: true },
      { path: '/user/edit', component: UserEdit },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
