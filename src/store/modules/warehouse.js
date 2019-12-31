import Vue from "vue";

export default {
  state: {
    rawStockData: [],
    rawStorageData: []
  },
  mutations: {
    updateStock(state, payload) {
      state.rawStockData = payload.data;
    },
    updateStorage(state, payload) {
      state.rawStorageData = payload.data;
    }
  },
  getters: {
    stockData: state => {
      let [...data] = state.rawStockData;
      data.forEach(item => {
        item.weight = 0;
        state.rawStorageData.forEach(item2 => {
          if (item.stockName === item2.name)
            item.weight += Number(item2.numbers);
        });
      });
      return data;
    },
    stockOptions: state => {
      let data = [];
      state.rawStockData.forEach(item => {
        let dataItem = {};
        dataItem.stockName = item.stockName;
        dataItem.unit = item.unit;
        data.push(dataItem);
      });
      return data;
    },

    storageData: (state, getters) => {
      let [...data] = state.rawStorageData;
      let options = getters.stockOptions;
      data.forEach(item => {
        options.forEach(item2 => {
          if (item2.stockName === item.name) {
            item.stockName = item2.stockName;
            item.unit = item2.unit;
          }
        });
      });
      return data;
    }
  },
  actions: {
    async init({ dispatch }) {
      dispatch("fetchStockData");
      dispatch("fetchStorageData");
    },

    async fetchStockData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllStocks");
      res.data.data.stock.forEach(item => {
        item.weight = 0;
      });
      commit({
        type: "updateStock",
        data: res.data.data.stock
      });
    },
    async updateStockData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateStock", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertStock", payload.data);
      }
      await dispatch("fetchStockData");
    },
    async deleteStockDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteStock/${payload.data}`);
      await dispatch("fetchStockData");
    },

    async fetchStorageData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllStorage");
      commit({
        type: "updateStorage",
        data: res.data.data.storages
      });
    },
    async updateStorageData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateStorage", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertStorage", payload.data);
      }
      await dispatch("fetchStorageData");
    },
    async deleteStorageDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteStorage/${payload.data}`);
      await dispatch("fetchStorageData");
    }
  }
};
