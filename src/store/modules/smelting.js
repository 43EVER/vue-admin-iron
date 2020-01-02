import Vue from "vue";

export default {
  state: {
    rawSmeltingRecordData: [],
    rawSmeltingData: []
  },
  mutations: {
    updateSmeltingRecordData(state, payload) {
      state.rawSmeltingRecordData = payload.data;
    },
    updateSmeltingData(state, payload) {
      state.rawSmeltingData = payload.data;
    }
  },
  getters: {
    smeltingRecordData: state => {
      let [...data] = state.rawSmeltingRecordData;
      // 测试用
      data.forEach(item => {
        item.smeltingDetails = JSON.parse(item.smeltingDetails);
      });
      return data;
    },
    smeltingData: state => {
      let [...data] = state.rawSmeltingData;
      return data;
    }
  },
  actions: {
    async fetchSmeltingRecordData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllSmeltingRecord");
      if (res.data.data) {
        commit({
          type: "updateSmeltingRecordData",
          data: res.data.data.SmeltingRecords
        });
      }
    },
    async updateSmeltingRecordData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateSmeltingRecord", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertSmeltingRecord", payload.data);
      }
      await dispatch("fetchSmeltingRecordData");
    },
    async deleteSmeltingRecordDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteSmeltingRecord/${payload.data}`);
      await dispatch("fetchSmeltingRecordData");
    },

    async fetchSmeltingData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllSmelt");
      if (res.data.data) {
        commit({
          type: "updateSmeltingData",
          data: res.data.data.smelt
        });
      }
    },
    async updateSmeltingData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateSmelt", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertSmelt", payload.data);
      }
      await dispatch("fetchSmeltingData");
    },
    async deleteSmeltingDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteSmeltById/${payload.data}`);
      await dispatch("fetchSmeltingData");
    }
  }
};
