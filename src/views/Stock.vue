<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增原料</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的原料名称" v-model="searchStockName">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column prop="stockName" label="原料名称"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="weight" label="数量"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popover :ref="'popover' + scope.$index">
            <p>确定删除 {{ scope.row.stockName }} 吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" size="mini" @click="closeDeletePopover(scope.$index)">取消</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row, scope.$index)">确定</el-button>
            </div>
            <el-button size="mini" type="danger" slot="reference" style="margin-left: 1rem">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="editDialogTitle" width="30%" :before-close="handleEditDialogClose"
      :visible="editDialogVisible" center>
      <el-form :model="editDialogData">
        <el-form-item label="原料名称">
          <el-input v-model="editDialogData.stockName"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="editDialogData.unit"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editDialogData.weight" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialogData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchStockName: "",
      loading: true,
      editDialogVisible: false,
      editDialogTitle: "",
      editDialogData: {
        id: undefined,
        stockName: "",
        unit: "",
        weight: 0
      }
    };
  },
  computed: {
    filteredData() {
      if (this.searchStockName)
        return this.stockData.filter(item => {
          if (item.stockName.indexOf(this.searchStockName) !== -1) return true;
          return false;
        });
      return this.stockData;
    },
    ...mapGetters(["stockData"])
  },
  created() {
    this.fetch();
  },
  methods: {
    handleEditDialogClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
          this.editDialogVisible = false;
        })
        .catch(() => {});
    },
    closeDeletePopover(index) {
      this.$refs["popover" + index].doClose();
    },
    async fetch() {
      this.loading = true;
      await this.$store.dispatch("fetchStockData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.stockName;
      this.editDialogData = Object.assign(this.editDialogData, row);
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增原料";
      this.editDialogData.weight = 0;
      this.editDialogData.id = undefined;
      this.editDialogData.stockName = "";
      this.editDialogData.unit = "";
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      await this.$store.dispatch({
        type: "updateStockData",
        data: this.editDialogData
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteStockDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
};
</script>
