<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增压型记录</el-button>
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
          <el-form label-position="left" inline class="table-expand" label-width="110px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="编号">
                  {{ props.row.serial }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="压机编号">
                  {{ props.row.machineSerial }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="毛坯数量">
                  {{ props.row.billetAmount }} 块
                </el-form-item>
              </el-col>
          </el-row>
          <el-form-item label="日期">
            {{ props.row.createTime }}
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="领料">
                {{ props.row.pickingWeight }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品单重">
                {{ props.row.singleProduct }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模具编号及尺寸">
                {{ props.row.toolsInfo }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="row in props.row.billetSizes.rows[0]" :key="row.col0">
            <el-col :span="8">
              <el-form-item :label="row.col0 + row.col1">
                {{ row.col2 }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="row.col0 + row.col3">
                {{ row.col4 }}
              </el-form-item>
            </el-col>
          </el-row>
          <span><h3>设计压坯尺寸（mm）</h3></span>
          <el-table :data="props.row.billetSizes.rows[1]" border>
            <el-table-column prop="col1" label="压制"></el-table-column>
            <el-table-column prop="col2" label="模宽"></el-table-column>
            <el-table-column prop="col3" label="取向"></el-table-column>
          </el-table>
          <el-row>
            <el-col :span="8">
              <el-form-item label="氮气量（开始）">
                {{ props.row.starNitrogen }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="氮气量（结束）">
                {{ props.row.endNitrogen }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作人">
                {{ props.row.operator }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注">
            {{ props.row.note }}
          </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="serial"></el-table-column>
      <el-table-column label="压机编号" prop="machineSerial"></el-table-column>
      <el-table-column label="日期" prop="createTime"></el-table-column>
      <el-table-column label="毛坯数量">
        <template slot-scope="scope">
          {{ scope.row.billetAmount }} 块
        </template>
      </el-table-column>
      <el-table-column label="模具编号及尺寸" prop="toolsInfo"></el-table-column>
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
              <el-input v-model="editDialogData.serial" :disabled="disableEditSerial"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="压机编号">
              <el-input v-model="editDialogData.machineSerial"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毛坯数量">
              <el-input v-model="editDialogData.billetAmount">
                <template slot="append">块</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="日期">
          <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="领料">
              <el-input v-model="editDialogData.pickingWeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品单重">
              <el-input v-model="editDialogData.singleProduct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模具编号及尺寸">
              <el-input v-model="editDialogData.toolsInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="row in editDialogData.billetSizes.rows[0]" :key="row.col0">
          <el-col :span="8">
            <el-form-item :label="row.col0 + row.col1">
              <el-input v-model="row.col2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="row.col0 + row.col3">
              <el-input v-model="row.col4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary" @click="editDialogData.billetSizes.rows[1].push({})">增加原料</el-button>
        <div v-if="editDialogData.billetSizes.rows[1].length>0" style="padding: 1rem"><h3>设计压坯尺寸（mm）</h3></div>
        <el-row v-for="(row, idx) in editDialogData.billetSizes.rows[1]" :key="row.col0">
          <el-col :span="7">
            <el-form-item label="压制">
              <el-input v-model="row.col1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="模宽">
              <el-input v-model="row.col2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="取向">
              <el-input v-model="row.col3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button style="float: right" size="medium" type="danger" @click="editDialogData.billetSizes.rows[1].splice(idx, 1)">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="氮气量（开始）">
              <el-input v-model="editDialogData.starNitrogen"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="氮气量（结束）">
              <el-input v-model="editDialogData.endNitrogen"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              <el-input v-model="editDialogData.operator"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="editDialogData.note"></el-input>
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
      editDialogTitle: "",
      editDialogData: {
        billetSizes: {
          rows: [
            [
              { col0: "压制", col1: "压力", col3: "时间" },
              { col0: "充磁", col1: "电流", col3: "时间" },
              { col0: "退磁", col1: "电流", col3: "时间" },
              { col0: "氧含量", col1: "称料室", col3: "包装室" }
            ],
            []
          ]
        }
      }
    };
  },
  created() {
    this.fetch();
  },
  computed: {
    filteredData() {
      let [...data] = this.pressureRecordData;
      if (this.searchSerial) {
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      }
      data.forEach(item => {
        item.billetSizes = JSON.parse(item.billetSizes);
      });
      return data;
    },
    ...mapGetters(["pressureRecordData"])
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
      await this.$store.dispatch("fetchPressureRecordData");
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
      this.editDialogTitle = "新增压型记录";
      this.disableEditSerial = false;
      this.editDialogData = {
        createTime: new Date(),
        billetSizes: {
          rows: [
            [
              { col0: "压制", col1: "压力", col3: "时间" },
              { col0: "充磁", col1: "电流", col3: "时间" },
              { col0: "退磁", col1: "电流", col3: "时间" },
              { col0: "氧含量", col1: "称料室", col3: "包装室" }
            ],
            []
          ]
        }
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      data.billetSizes = JSON.stringify(this.editDialogData.billetSizes);
      await this.$store.dispatch({
        type: "updatePressureRecordData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deletePressureRecordDataById",
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
