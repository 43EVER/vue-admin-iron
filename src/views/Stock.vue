<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增入库记录</el-button>
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
              <el-button
                type="text"
                size="mini"
                @click="closeDeletePopover(scope.$index)"
                >取消</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.row, scope.$index)"
                >确定</el-button
              >
            </div>
            <el-button
              size="mini"
              type="danger"
              slot="reference"
              style="margin-left: 1rem"
              >删除</el-button
            >
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="editDialogTitle"
      width="30%"
      :before-close="handleEditDialogClose"
      :open="handleEditDialogOpen"
      :visible="editDialogVisible"
      center
    >
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
export default {
  data() {
    return {
      data: {
        stock: []
      },
      searchStockName: "",
      loading: true,
      editDialogVisible: false,
      editDialogTitle: "",
      editDialogData: {}
    };
  },
  computed: {
    filteredData() {
      if (this.searchStockName)
        return this.data.stock.filter(e => {
          if (e.stockName.indexOf(this.searchStockName) !== -1) return true;
          return false;
        });
      return this.data.stock;
    }
  },
  created() {
    this.fetch();
    console.log(this.$route.path);
  },
  methods: {
    async fetch() {
      this.loading = true;
      // const res = await this.$http.get("/api/getAllStocks");
      // console.log(res.data.data.stock);
      // this.data = res.data.data;
      this.data.stock = [
        { id: 1, stockName: "Fe", unit: "Kg", weight: 120 },
        { id: 2, stockName: "Al", unit: "Kg", weight: 240 }
      ];
      this.data.stock.forEach(e => {
        e.popoverVisible = false;
      });
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.stockName;
      this.editDialogData = row;
    },
    handleEditDialogOpen(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.stockName;
      this.editDialogData = row;
    },
    handleEditDialogClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
          this.editDialogVisible = false;
        })
        .catch(() => {});
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增原料";
      this.editDialogData.weight = 0;
    },
    async submitDialogData() {
      if (this.editDialogTitle.indexOf("编辑") !== -1) {
        console.log("update data");
      } else {
        console.log("post data");
      }
    },
    handleDelete(row, index) {
      console.log("has been deleted");
      this.closeDeletePopover(index);
    },
    closeDeletePopover(index) {
      this.$refs["popover" + index].doClose();
    }
  }
};
</script>
