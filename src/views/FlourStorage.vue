<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-input placeholder="请输入要搜索的原料名称" v-model="searchSerial">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="spittingWeight" label="数量"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchSerial: "",
      loading: true
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    filteredData() {
      if (this.searchSerial)
        return this.flourData.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      return this.flourData;
    },
    ...mapGetters(["flourData"])
  },
  methods: {
    async fetch() {
      this.loading = true;
      await this.$store.dispatch("fetchFlourMillingData");
      this.loading = false;
    }
  }
};
</script>
