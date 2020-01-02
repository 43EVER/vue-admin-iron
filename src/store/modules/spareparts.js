import Vue from "vue";

export default {
  state: {
    rawSparePartsData: []
  },
  mutations: {
    updateSpareParts(state, payload) {
      state.rawSparePartsData = payload.data;
    }
  },
  getters: {
    sparePartsData: state => {
      let [...rawData] = state.rawSparePartsData;
      let data = [];
      rawData.forEach(item => {
        let canInsert = true;
        data.forEach(dataItem => {
          if (dataItem.serial === item.serial) {
            dataItem.data.push(item);
            canInsert = false;
          }
        });
        if (canInsert) {
          data.push({
            serial: item.serial,
            compositeOperator: item.compositeOperator,
            ingredientOperator: item.ingredientOperator,
            note: item.note,
            createTime: item.createTime,
            data: [item]
          });
        }
      });
      return data;
    },
    rawSparePartsData: state => state.rawSparePartsData
  },
  actions: {
    async fetchSparePartsData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllSpareParts");
      if (res.data.data) {
        commit({
          type: "updateSpareParts",
          data: res.data.data.SpareParts
        });
      }
    },
    async deleteSparePartsDataBySerial({ dispatch, getters }, payload) {
      for (let index in getters.sparePartsData) {
        let item = getters.sparePartsData[index];
        if (item.serial === payload.data) {
          for (let idx in item.data) {
            await Vue.prototype.$http.delete(`/api/deleteSpareParts/${item.data[idx].id}`);
          }
          break;
        }
      }
      await dispatch("fetchSparePartsData");
    },
    async insertSparePartsData({ dispatch }, payload) {
      for (let idx in payload.data.data) {
        let item = payload.data.data[idx];
        await Vue.prototype.$http.post("/api/insertSpareParts", item);
      }
      await dispatch("fetchSparePartsData");
    }
  }

};
