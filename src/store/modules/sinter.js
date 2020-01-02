import Vue from "vue";

export default {
  state: {
    rawSinterData: []
  },
  mutations: {
    updateSinterData(state, payload) {
      state.rawSinterData = payload.data;
    }
  },
  getters: {
    sinterData: state => {
      let [...data] = state.rawSinterData;
      return data;
    }
  },
  actions: {
    async fetchSinterData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getSinter");
      if (res.data.data) {
        commit({
          type: "updateSinterData",
          data: res.data.data.AgglomerationProcessRecordVo
        });
      }
      console.log("sinter data");
      console.log(res.data);
    },
    async updateSinterData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateSinter", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertSinter", payload.data);
      }
      await dispatch("fetchSinterData");
    },
    async deleteSinterDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteSinter/${payload.data}`);
      await dispatch("fetchSinterData");
    }
  }
};
