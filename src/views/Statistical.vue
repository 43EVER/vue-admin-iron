<template>
  <div class="stock">
    <el-row>
      <el-col :span="12" :offset="2">
        <el-date-picker
          v-model="searchTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="起初" prop="initAmount"></el-table-column>
      <el-table-column label="增加" prop="deltaAmountAdd"></el-table-column>
      <el-table-column label="减少" prop="deltaAmountMinus"></el-table-column>
      <el-table-column label="最终" prop="final"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      searchTimeRange: []
    }
  },
  computed: {
    ...mapGetters(["statisticalData"]),
    filteredData() {
      if (this.searchTimeRange) {
        return this.statisticalData([moment(this.searchTimeRange[0]).format("YYYY-M-D"), moment(this.searchTimeRange[1]).format("YYYY-M-D")]);
      }
      return [];
    }
  }
}
</script>