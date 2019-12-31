import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
    children: [
      { path: "/stock", component: () => import("../views/Stock.vue") },
      { path: "/storage", component: () => import("../views/Storage.vue") },
      { path: "/spareparts", component: () => import("../views/SpareParts.vue") },
      { path: "/smeltingrecord", component: () => import("../views/SmeltingRecord.vue") },
      { path: "/smelting", component: () => import("../views/Smelting.vue") }
    ]
  }
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
