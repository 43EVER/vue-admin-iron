import Vue from "vue";
import Vuex from "vuex";

import Warehouse from "./modules/warehouse";
import Spareparts from "./modules/spareparts";
import Smelting from "./modules/smelting";
import FlourMilling from "./modules/flourmilling";
import PressureRecord from "./modules/pressurerecord";
import Sinter from "./modules/sinter";
import Product from "./modules/product";
import Sales from "./modules/sales";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    async init({ dispatch }) {
      await dispatch("fetchStockData");
      await dispatch("fetchStorageData");
      await dispatch("fetchSparePartsData");
      await dispatch("fetchSalesData");
      
    }
  },
  modules: {
    Warehouse,
    Spareparts,
    Smelting,
    FlourMilling,
    PressureRecord,
    Sinter,
    Product,
    Sales
  }
});
