import Vue from "vue";

export default {
  state: {
    rawFlourMillingData: [],
    rawPowderData: []
  },
  mutations: {
    updateFlourMillingData(state, payload) {
      state.rawFlourMillingData = payload.data;
    },
    updatePowderData(state, payload) {
      state.rawPowderData = payload.data; 
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
    powderData: state => {
      let [...data] = state.rawPowderData;
      return data;
    },
    flourData: state => {
      let data = [];
      state.rawPowderData.forEach(item => {
        let canInsert = true;
        data.forEach(item2 => {
          if (item2.serial === item.serial) {
            canInsert = false;
            item2.number += Number(item.number);
          }
        });
        if (canInsert) {
          data.push({
            serial: item.serial,
            number: Number(item.number)
          });
        }
      });

      state.rawFlourMillingData.forEach(item => {
        let canInsert = true;
        data.forEach(item2 => {
          if (item2.serial === item.serial) {
            canInsert = false;
            item2.number -= Number(item.feedWeight);
          }
        });
        if (canInsert) {
          data.push({
            serial: item.serial,
            number: -Number(item.feedWeight)
          });
        }
      });

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
    },

    async fetchPowderData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllPowder");
      if (res.data.data) {
        commit({
          type: "updatePowderData",
          data: res.data.data.Powder
        });
      }
    },
    async updatePowderData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/UpdatePowderByCode", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertPower", payload.data);
      }
      
      await dispatch("fetchPowderData");
    },
    async deletePowderDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deletePowder/${payload.data}`);
      await dispatch("fetchPowderData");
    }
  }
};
