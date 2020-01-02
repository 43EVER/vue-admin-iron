<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增烧结记录</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的编号" v-model="searchSerial">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-width="110px">
            <el-form-item label="烧结工艺">
              {{ scope.row.pressedInfor.name }}
            </el-form-item>
            <el-table :data="scope.row.pressedInfor.data" border>
              <el-table-column prop="col1" label="时间"></el-table-column>
              <el-table-column prop="col2" label="累计时间"></el-table-column>
              <el-table-column prop="col3" label="时效过程"></el-table-column>
              <el-table-column prop="col4" label="炉温"></el-table-column>
              <el-table-column prop="col5" label="真空度"></el-table-column>
            </el-table>
            <el-form-item label="备注">
              {{ scope.row.pressedInfor.note }}
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="操作人白班">
                  {{ scope.row.pressedInfor.operatorInfo.row1 }}
                </el-form-item>
                <el-form-item label="操作人夜班班">
                  {{ scope.row.pressedInfor.operatorInfo.row2 }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="serial"></el-table-column>
      <el-table-column label="日期" prop="createTime"></el-table-column>
      <el-table-column label="备注">
        <template slot-scope="props">
          {{ props.row.pressedInfor.note }}
        </template>
      </el-table-column>
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
        </el-row>
        <el-form-item label="日期">
          <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="烧结工艺名称">
          <el-input v-model="editDialogData.pressedInfor.name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="editDialogData.pressedInfor.data.push({})">增加记录</el-button>
        <el-card v-for="(data, idx) in editDialogData.pressedInfor.data" :key="idx">
          <div slot="header">
            <el-button
              style="float: right; padding: 3px 0"
              type="danger"
              size="mini"
              @click="editDialogData.pressedInfor.data.splice(idx, 1)"
              >删除</el-button
            >
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="时间">
                <el-input v-model="data.col1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="累计时间">
                <el-input v-model="data.col2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="时效过程">
                <el-input v-model="data.col3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="炉温">
                <el-input v-model="data.col4"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="真空度">
                <el-input v-model="data.col5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item label="备注">
          <el-input v-model="editDialogData.pressedInfor.note" type="textarea"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作人白班">
              <el-input v-model="editDialogData.pressedInfor.operatorInfo.row1"></el-input>
            </el-form-item>
            <el-form-item label="操作人夜班班">
              <el-input v-model="editDialogData.pressedInfor.operatorInfo.row2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
      editDialogTitle: "",
      editDialogData: {
        pressedInfor: {
          name: "",
          data: [],
          operatorInfo: {
            row1: "",
            row2: ""
          }
        }
      }
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    filteredData() {
      let [...data] = this.pressedProcessRecordData;
      if (this.searchSerial) {
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      }
      data.forEach(item => {
        item.pressedInfor = JSON.parse(item.pressedInfor);
      });
      return data;
    },
    ...mapGetters(["pressedProcessRecordData"])
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
      await this.$store.dispatch("fetchPressedProcessRecordData");
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
      this.editDialogTitle = "新增压型工艺记录";
      this.disableEditSerial = false;
      this.editDialogData = {
        createTime: new Date(),
        pressedInfor: {
          name: "",
          data: [],
          operatorInfo: {
            row1: "",
            row2: ""
          }
        }
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      // 转换数据
      data.pressedInfor = JSON.stringify(data.pressedInfor);
      await this.$store.dispatch({
        type: "updatePressedProcessRecordData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deletePressedProcessRecordDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
}
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
