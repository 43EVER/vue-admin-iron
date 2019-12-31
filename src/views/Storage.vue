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
      <el-col :span="12" :offset="2">
        <el-date-picker
          v-model="searchDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column prop="id" label="记录编号"></el-table-column>
      <el-table-column prop="stock.stockName" label="原料名称"></el-table-column>
      <el-table-column prop="stock.unit" label="单位"></el-table-column>
      <el-table-column prop="numbers" label="数量"></el-table-column>
      <el-table-column prop="createDate" label="创建日期"></el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
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
      :visible="editDialogVisible"
      center
    >
      <el-form :model="editDialogData">
        <el-form-item label="原料" required>
          <el-select v-model="editDialogData.stock" value-key="stockName">
            <el-option
              v-for="option in stockOptions"
              :key="option.stockName"
              :label="option.stockName"
              :value="option"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位">
          <el-input :value="editDialogData.stock.unit" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editDialogData.numbers" type="number"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="editDialogData.createDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editDialogData.note" type="textarea"></el-input>
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
import moment from "moment";

export default {
  data() {
    return {
      searchStockName: "",
      loading: true,
      editDialogVisible: false,
      editDialogTitle: "",
      editDialogData: {
        name: "",
        numbers: 0,
        note: "",
        createDate: new Date(),
        stock: {}
      },
      searchDateRange: []
    };
  },
  computed: {
    filteredData() {
      let data = this.storageData;
      if (this.searchStockName) {
        data = this.storageData.filter(e => {
          if (e.name.indexOf(this.searchStockName) !== -1) return true;
          return false;
        });
      }
      if (
        this.searchDateRange instanceof Array &&
        this.searchDateRange.length === 2
      ) {
        let begin = moment(this.searchDateRange[0]);
        let end = moment(this.searchDateRange[1]);
        data = data.filter(item => {
          let date = moment(item.createDate, "YYYY-M-D");
          if (date.isAfter(begin) && date.isBefore(end)) return true;
          return false;
        });
      }
      data.forEach(item => {
        this.stockOptions.forEach(item2 => {
          if (item.name === item2.stockName) item.stock = item2;
        });
      });
      return data;
    },
    ...mapGetters(["storageData", "stockOptions"])
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
      await this.$store.dispatch("fetchStorageData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑记录";
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createDate = moment(
        row.createDate,
        "YYYY-M-D"
      ).toDate();
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增记录";
      this.editDialogData = {
        stock: {
          stockName: "",
          unit: ""
        },
        createDate: new Date(),
        note: ""
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      this.editDialogData.name = this.editDialogData.stock.stockName;
      this.editDialogData.createDate = moment(this.editDialogData.createDate).format("YYYY-M-D");
      await this.$store.dispatch({
        type: "updateStorageData",
        data: this.editDialogData
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteStorageDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
};
</script>
