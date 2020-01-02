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
      { path: "/flourstorage", component: () => import("../views/FlourStorage.vue") },
      { path: "/product", component: () => import("../views/Product.vue") },
      { path: "/spareparts", component: () => import("../views/SpareParts.vue") },
      { path: "/smeltingrecord", component: () => import("../views/SmeltingRecord.vue") },
      { path: "/smelting", component: () => import("../views/Smelting.vue") },
      { path: "/flourmilling", component: () => import("../views/FlourMilling.vue") },
      { path: "/pressurerecord", component: () => import("../views/PressureRecord.vue") },
      { path: "/pressedprocessRecord", component: () => import("../views/PressedProcessRecord.vue") },
      { path: "/sinter", component: () => import("../views/Sinter.vue") },
      { path: "/sales", component: () => import("../views/Sales.vue") }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
