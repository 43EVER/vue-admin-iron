import Vue from "vue";
import Vuex from "vuex";

import Warehouse from "./modules/warehouse";
import Spareparts from "./modules/spareparts";
import Smelting from "./modules/smelting";
import FlourMilling from "./modules/flourmilling";
import PressureRecord from "./modules/pressurerecord";
import Sinter from "./modules/sinter";
import Product from "./modules/product";
import Sales from "./modules/sales";
import Users from "./modules/users"

import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    async init({ dispatch }) {
      await dispatch("fetchStockData");
      await dispatch("fetchStorageData");
      await dispatch("fetchSparePartsData");
      await dispatch("fetchSalesData");

    }
  },
  getters: {
    statisticalData: (state, getters) => (timeRange) => {
      // console.log(getters.storageData);
      // console.log(getters.salesData);
      // let initStock = [];

      // getters.storageData.forEach(item => {
      //   let canInsert = true;
      //   let time = moment(item.createDate, "YYYY-M-D");
      //   initStock.forEach(item2 => {
      //     if (item2.name === item.name && time.isBefore(begin)) {
      //       canInsert = false;
      //       item2.amount += Number(item.numbers);
      //     }
      //   });
      //   if (canInsert) {
      //     initStock.push({
      //       name: item.name,
      //       amount: Number(item.numbers)
      //     });
      //   }
      // });
      // getters.rawSparePartsData.forEach(item => {
      //   let canInsert = true;

      // })
      
      // let deltaStock = [];
      // getters.storageData.forEach(item => {
      //   let canInsert = true;
      //   let time = moment(item.createDate, "YYYY-M-D");
      //   deltaStock.forEach(item2 => {

      //   })
      // })

      let begin = moment(timeRange[0], "YYYY-M-D");
      let end = moment(timeRange[1], "YYYY-M-D");

      let stockAddData = getters.storageData.map(item => ({
        name: item.name,
        amount: Number(item.numbers),
        createTime: moment(item.createDate, "YYYY-M-D")
      }));
      let stockMinusData = getters.rawSparePartsData.map(item => ({
        name: item.composition,
        amount: Number(item.requirementWeight),
        createTime: moment(item.createTime, "YYYY-M-D")
      }));

      let data = new Map();

      stockAddData.forEach(item => {
        if (item.createTime.isBefore(end)) {
          if (item.createTime.isBefore(begin)) {
            if (data.has(item.name)) {
              data.get(item.name).initAmount += item.amount;
            } else {
              data.set(item.name, { initAmount: item.amount, deltaAmountAdd: 0, deltaAmountMinus: 0 });
            }
          } else {
            if (data.has(item.name)) {
              data.get(item.name).deltaAmountAdd += item.amount;
            } else {
              data.set(item.name, { initAmount: 0,  deltaAmountAdd: item.amount, deltaAmountMinus: 0 });
            }
          }
        }
      });

      stockMinusData.forEach(item => {
        if (item.createTime.isBefore(end)) {
          if (item.createTime.isBefore(begin)) {
            if (data.has(item.name)) {
              data.get(item.name).initAmount -= item.amount;
            } else {
              data.set(item.name, { initAmount: -item.amount, deltaAmountAdd: 0, deltaAmountMinus: 0 });
            }
          } else {
            if (data.has(item.name)) {
              data.get(item.name).deltaAmountMinus += item.amount;
            } else {
              data.set(item.name, { initAmount: 0, deltaAmountAdd: 0, deltaAmountMinus: item.amount });
            }
          }
        }
      });

      let res = [];

      data.forEach((value, key) => {
        let tmp = Object.assign({}, value);
        tmp.name = key;
        tmp.final = value.initAmount + value.deltaAmountAdd - value.deltaAmountMinus;
        res.push(tmp);
      });

      console.log(res);

      return res;
    }
  },
  modules: {
    Warehouse,
    Spareparts,
    Smelting,
    FlourMilling,
    PressureRecord,
    Sinter,
    Product,
    Sales,
    Users
  }
});
