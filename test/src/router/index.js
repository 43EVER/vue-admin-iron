import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '../views/Main.vue'

import DataList from '../views/DataList.vue'
import DataEdit from '../views/DataEdit.vue'

import SparePartsList from '../views/SparePartsList.vue'
import SparePartsEdit from '../views/SparePartsEdit.vue'

import FlourMillingProcessList from '../views/FlourMillingProcessList.vue'
import FlourMillingProcessEdit from '../views/FlourMillingProcessEdit.vue'

import StockList from '../views/StockList.vue'
import StockEdit from '../views/StockEdit.vue'

import PressureRecordList from '../views/PressureRecordList.vue'
import PressureRecordEdit from '../views/PressureRecordEdit.vue'


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

      { path: '/spareparts/list', component: SparePartsList },
      { path: '/spareparts/edit/:brandName', component: SparePartsEdit, props: true },
      { path: '/spareparts/edit', component: SparePartsEdit },

      { path: '/flourmillingprocess/list', component: FlourMillingProcessList },
      { path: '/flourmillingprocess/edit/:id', component: FlourMillingProcessEdit, props: true },
      { path: '/flourmillingprocess/edit', component: FlourMillingProcessEdit },

      { path: '/stock/list', component: StockList },
      { path: '/stock/edit/:id', component: StockEdit, props: true },
      { path: '/stock/edit', component: StockEdit },

      { path: '/pressurerecord/list', component: PressureRecordList },
      { path: '/pressurerecord/edit/:id', component: PressureRecordEdit, props: true },
      { path: '/pressurerecord/edit', component: PressureRecordEdit },



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
