import Vue from "vue";

export default {
  state: {
    rawProductData: []
  },
  mutations: {
    updateProductData(state, payload) {
      state.rawProductData = payload.data;
    }
  },
  getters: {
    productData: (state, getters) => {
      let [...data] = state.rawProductData;
      data.forEach(item => {
        item.amount2 = Number(item.amount);
        getters.salesData.forEach(item2 => {
          if (item2.serial === item.serial) item.amount2 -= Number(item2.amount);
        });
      });
      return data;
    }
  },
  actions: {
    async fetchProductData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllProduct");
      if (res.data.data) {
        commit({
          type: "updateProductData",
          data: res.data.data.Product
        });
      }
    },
    async updateProductData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateProduct", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertProduct", payload.data);
      }
      await dispatch("fetchProductData");
    },
    async deleteProductDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteProduct/${payload.data}`);
      await dispatch("fetchProductData");
    }
  }
};
