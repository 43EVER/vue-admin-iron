<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增冶炼记录</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的编号" v-model="searchSerial">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="第一桶皮重">
              <span>{{ props.row.bucketsInfo[0].col1 }}</span>
            </el-form-item>
            <el-form-item label="第一桶净重">
              <span>{{ props.row.bucketsInfo[0].col2 }}</span>
            </el-form-item>
            <el-form-item label="第二桶皮重">
              <span>{{ props.row.bucketsInfo[1].col1 }}</span>
            </el-form-item>
            <el-form-item label="第二桶净重">
              <span>{{ props.row.bucketsInfo[1].col2 }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="日期"></el-table-column>
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="outWeigth" label="出料"></el-table-column>
      <el-table-column prop="feedWeigth" label="入料"></el-table-column>
      <el-table-column label="收率">
        <template slot-scope="scope">
          {{ scope.row.yield }} %
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人"></el-table-column>
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
    <el-dialog :title="editDialogTitle" width="50%" :before-close="handleEditDialogClose"
      :visible="editDialogVisible" center>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="日期">
              <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="编号">
              <el-input v-model="editDialogData.serial" :disabled="disableEditSerial"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="第一桶皮重">
              <el-input v-model="editDialogData.bucketsInfo[0].col1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="第一桶净重">
              <el-input v-model="editDialogData.bucketsInfo[0].col2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="第二桶皮重">
              <el-input v-model="editDialogData.bucketsInfo[1].col1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="第二桶净重">
              <el-input v-model="editDialogData.bucketsInfo[1].col2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出料">
              <el-input v-model="editDialogData.outWeigth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入料">
              <el-input v-model="editDialogData.feedWeigth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收率">
              <el-input :value="editDialogData.outWeigth/editDialogData.feedWeigth*100" disabled>
                <template slot="append">
                  %
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="操作人">
          <el-input v-model="editDialogData.operator"></el-input>
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
import moment from 'moment';
export default {
  data() {
    return {
      searchSerial: "",
      loading: true,
      editDialogVisible: false,
      disableEditSerial: true,
      editDialogTitle: "",
      editDialogData: {
        createTime: new Date(),
        bucketsInfo: [
          { col1: "", col2: "" },
          { col1: "", col2: "" }
        ],
      }
    };
  },
  computed: {
    filteredData() {
      let [...data] = this.smeltingData;
      if (this.searchSerial)
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      data.forEach(item => {
        if (!(item.bucketsInfo instanceof Array)) item.bucketsInfo = JSON.parse(item.bucketsInfo);
      });
      return data;
    },
    ...mapGetters(["smeltingData"])
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
      await this.$store.dispatch("fetchSmeltingData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.disableEditSerial = true;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createTime = moment(this.editDialogData.createTime, "YYYY-M-D").toDate();
      console.log(this.editDialogData);
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增冶炼记录";
      this.disableEditSerial = false;
      this.editDialogData = {
        createTime: new Date(),
        bucketsInfo: [
          { col1: "", col2: "" },
          { col1: "", col2: "" }
        ]
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      this.editDialogData.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      this.editDialogData.bucketsInfo = JSON.stringify(this.editDialogData.bucketsInfo);
      console.log(this.editDialogData);
      this.editDialogData.yield = this.editDialogData.outWeigth/this.editDialogData.feedWeigth*100;
      await this.$store.dispatch({
        type: "updateSmeltingData",
        data: this.editDialogData
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteSmeltingDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
};
</script>

<style lang="scss">
.table-expand {
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
