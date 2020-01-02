import Vue from "vue";

export default {
  state: {
    rawPressureRecordData: [],
    rawPressedProcessRecordData: []
  },
  mutations: {
    updatePressureRecordData(state, payload) {
      state.rawPressureRecordData = payload.data;
    },
    updatePressedProcessRecord(state, payload) {
      state.rawPressedProcessRecordData = payload.data;
    }
  },
  getters: {
    pressureRecordData: state => {
      let [...data] = state.rawPressureRecordData;
      // 测试用
      // data.forEach(item => {
      //   item.billetSizes = JSON.parse(item.billetSizes);
      // });
      return data;
    },
    pressedProcessRecordData: state => {
      let [...data] = state.rawPressedProcessRecordData;
      return data;
    }
  },
  actions: {
    async fetchPressureRecordData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllPressureRecord");
      if (res.data.data) {
        commit({
          type: "updatePressureRecordData",
          data: res.data.data.pressureRecords
        });
      }
    },
    async updatePressureRecordData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updatePressureRecord", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertPressureRecord", payload.data);
      }
      await dispatch("fetchPressureRecordData");
    },
    async deletePressureRecordDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deletePressureRecord/${payload.data}`);
      await dispatch("fetchPressureRecordData");
    },

    async fetchPressedProcessRecordData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllPressedProcessRecord");
      if (res.data.data) {
        commit({
          type: "updatePressedProcessRecord",
          data: res.data.data.pressedProcessRecord
        });
      }
    },
    async updatePressedProcessRecordData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updatePressedProcessRecord", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertPressedProcessRecord", payload.data);
      }
      await dispatch("fetchPressedProcessRecordData");
    },
    async deletePressedProcessRecordDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deletePressedProcessRecordById/${payload.data}`);
      await dispatch("fetchPressedProcessRecordData");
    }
  }
};
