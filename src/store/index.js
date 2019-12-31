import Vue from "vue";
import Vuex from "vuex";

import Warehouse from "./modules/warehouse";
import Spareparts from "./modules/spareparts";
import Smelting from "./modules/smelting";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Warehouse,
    Spareparts,
    Smelting
  }
});
