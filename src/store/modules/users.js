import Vue from "vue";

export default {
  state: {
    rawUsersData: []
  },
  mutations: {
    updateUsersData(state, payload) {
      state.rawUsersData = payload.data;
    }
  },
  getters: {
    usersData: state => {
      let [...data] = state.rawUsersData;
      return data;
    }
  },
  actions: {
    async fetchUsersData({ commit }) {
      const res = await Vue.prototype.$http.get("/api/getAllUsers");
      if (res.data.data) {
        commit({
          type: "updateUsersData",
          data: res.data.data.users
        });
      }
    },
    async updateUsersData({ dispatch }, payload) {
      if (payload.data.id) {
        await Vue.prototype.$http.put("/api/updateUser", payload.data);
      } else {
        await Vue.prototype.$http.post("/api/insertUser", payload.data);
      }
      await dispatch("fetchUsersData");
    },
    async deleteUsersDataById({ dispatch }, payload) {
      await Vue.prototype.$http.delete(`/api/deleteUser/${payload.data}`);
      await dispatch("fetchUsersData");
    }
  }

};
