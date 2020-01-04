<template>
  <div class="stock">
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的原料名称" v-model="searchStockName">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchStockName: ""
    };
  },
  computed: {
    filteredData() {
      let [...data] = this.flourData;
      if (this.searchStockName) {
        data = data.filter(e => {
          if (e.serial.indexOf(this.searchStockName) !== -1) return true;
          return false;
        });
      }
      return data;
    },
    ...mapGetters(["flourData"])
  }
};
</script>