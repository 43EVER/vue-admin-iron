import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './http'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/base.css'

Vue.config.productionTip = false

Vue.prototype.$http = http;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
