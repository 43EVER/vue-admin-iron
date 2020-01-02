import Vue from "vue";

export default {
  state: {
    rawFlourMillingData: []
  },
  mutations: {
    updateFlourMillingData(state, payload) {
      state.rawFlourMillingData = payload.data;
    }
  },
  getters: {
    flourMillingData: state => {
      let [...data] = state.rawFlourMillingData;
      // 测试用
      data.forEach(item => {
        item.flourDetails = JSON.parse(item.flourDetails);
      });
      return data;
    },
    flourData: state => {
      let [...data] = state.rawFlourMillingData;
      
      return data;
    }
  },
  actions: {
    async fetchFlourMillingData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllFlourMillingProcessRecord");
      if (res.data.data) {
        commit({
          type: "updateFlourMillingData",
          data: res.data.data.FlourMillingProcessRecordVo
        });
      }
    },
    async updateFlourMillingData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateFlourMillingProcessRecord", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertFlourMillingProcessRecords", payload.data);
      }
      await dispatch("fetchFlourMillingData");
    },
    async deleteFlourMillingDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteFlourMillingProcessRecords/${payload.data}`);
      await dispatch("fetchFlourMillingData");
    }
  }
};
