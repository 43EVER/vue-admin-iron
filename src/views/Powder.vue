<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增入库记录</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的编号" v-model="searchStockName">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column prop="id" label="记录编号"></el-table-column>
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
      <el-table-column prop="createTime" label="日期"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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
    <el-dialog :title="editDialogTitle" width="30%" :before-close="handleEditDialogClose"
      :visible="editDialogVisible" center>
      <el-form :model="editDialogData">
        <el-form-item label="编号">
          <el-input v-model="editDialogData.serial" :disabled="canDisable"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editDialogData.number"></el-input>
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
      canDisable: false,
      editDialogData: {
        createTime: new Date(),
        number: 0,
        serial: ""
      }
    };
  },
  computed: {
    filteredData() {
      if (this.searchStockName)
        return this.powderData.filter(item => {
          if (item.serial.indexOf(this.searchStockName) !== -1) return true;
          return false;
        });
      return this.powderData;
    },
    ...mapGetters(["powderData"])
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
      await this.$store.dispatch("fetchPowderData");
      this.loading = false;
    },
    handleEdit(row) {
      this.canDisable = true;
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createTime = moment(row.createTime, "YYYY-M-D").toDate();
    },
    handleCreate() {
      this.canDisable = false;
      this.editDialogVisible = true;
      this.editDialogTitle = "新增记录";
      this.editDialogData = {
        createTime: new Date()
      }
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      await this.$store.dispatch({
        type: "updatePowderData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deletePowderDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
};
</script>
