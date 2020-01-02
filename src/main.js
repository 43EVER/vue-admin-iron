import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import http from "./http";
Vue.prototype.$http = http;

import animated from "animate.css";
Vue.use(animated);

Vue.filter(
  "dateToTime",
  value => `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
);
