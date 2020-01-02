import Vue from "vue";

export default {
  state: {
    rawSalesData: []
  },
  mutations: {
    updateSales(state, payload) {
      state.rawSalesData = payload.data;
    }
  },
  getters: {
    salesData: state => {
      let [...data] = state.rawSalesData;
      return data;
    }
  },
  actions: {
    async fetchSalesData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllSales");
      if (res.data.data) {
        commit({
          type: "updateSales",
          data: res.data.data.sales
        });
      }
    },
    async updateSalesData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateSale", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertSales", payload.data);
      }
      await dispatch("fetchSalesData");
    },
    async deleteSalesDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteSale/${payload.data}`);
      await dispatch("fetchSalesData");
    }
  }

};
