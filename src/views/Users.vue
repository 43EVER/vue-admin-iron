<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="usersData">
      <el-table-column label="用户名" prop="usercode"></el-table-column>
      <el-table-column label="密码" prop="password"></el-table-column>
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
        <el-form-item label="用户名">
          <el-input v-model="editDialogData.usercode"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editDialogData.password"></el-input>
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
      loading: true,
      editDialogVisible: false,
      editDialogTitle: "",
      editDialogData: {}
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    ...mapGetters(["usersData"])
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
      await this.$store.dispatch("fetchUsersData");
      console.log(this.usersData);
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.usercode;
      this.disableEditSerial = true;
      this.editDialogData = JSON.parse(JSON.stringify(row));
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增用户";
      this.editDialogData = {};
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      await this.$store.dispatch({
        type: "updateUsersData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteUsersDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
}
</script>
