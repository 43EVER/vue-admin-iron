<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增销售记录</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的编号" v-model="searchSerial">
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
      <el-table-column label="编号" prop="serial"></el-table-column>
      <el-table-column label="日期" prop="createDate"></el-table-column>
      <el-table-column label="数量" prop="amount"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-popover :ref="'popover' + scope.$index">
            <p>确定删除 {{ scope.row.serial }} 吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" size="mini" @click="closeDeletePopover(scope.$index)">取消</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row, scope.$index)">确定</el-button>
            </div>
            <el-button size="mini" type="danger" slot="reference" style="margin-left: 1rem">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="editDialogTitle" width="50%" :before-close="handleEditDialogClose"
      :visible="editDialogVisible" center>
      <el-form label-width="110px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input v-model="editDialogData.serial"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">
              <el-date-picker v-model="editDialogData.createDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="数量">
              <el-input v-model="editDialogData.amount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
      searchSerial: "",
      loading: true,
      editDialogVisible: false,
      disableEditSerial: true,
      searchDateRange: [],
      editDialogTitle: "",
      editDialogData: {}
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    filteredData() {
      let [...data] = this.salesData;
      if (this.searchSerial) {
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
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
      return data;
    },
    ...mapGetters(["salesData"])
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
      await this.$store.dispatch("fetchSalesData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.disableEditSerial = true;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createDate = moment(this.editDialogData.createDate, "YYYY-M-D").toDate();
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增销售记录";
      this.disableEditSerial = false;
      this.editDialogData = {
        createDate: new Date()
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.createDate = moment(this.editDialogData.createDate).format("YYYY-M-D");
      console.log(data);
      await this.$store.dispatch({
        type: "updateSalesData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteSalesDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
}
</script>
