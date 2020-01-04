<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增磨粉记录</el-button>
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
            <el-row>
              <el-col :span="8">
                <el-form-item label="制粉起始时间" label-width="110px">
                  {{ (new Date(Number(props.row.flourDetails.row1.col1))) | dateToTime }}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="制粉终止时间" label-width="110px">
                  {{ (new Date(Number(props.row.flourDetails.row1.col2))) | dateToTime }}
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="制粉耗时（h）" label-width="110px">
                  {{ props.row.flourDetails.row1.col3 }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="制粉起始氧含量" label-width="110px">
                  {{ props.row.flourDetails.row2.col1 }} ppm
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="制粉过程氧含量" label-width="110px">
                  {{ props.row.flourDetails.row2.col2 }} ppm
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="制粉结束氧含量" label-width="110px">
                  {{ props.row.flourDetails.row2.col3 }} ppm
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="分选机转速" label-width="110px">
                  {{ props.row.flourDetails.row3.col1 }} rpm
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="研磨压力" label-width="110px">
                  {{ props.row.flourDetails.row3.col2 }} Mpa
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="制粉机起始流量" label-width="110px">
                  {{ props.row.flourDetails.row4.col1 }} Nm³
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="制粉机终止流量" label-width="110px">
                  {{ props.row.flourDetails.row4.col2 }} Nm³
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="日期"></el-table-column>
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="operator" label="制作人"></el-table-column>
      <el-table-column label="料重">
        <template slot-scope="scope">
          {{ scope.row.feedWeight }} Kg
        </template>
      </el-table-column>
      <el-table-column label="吐料">
        <template slot-scope="scope">
          {{ scope.row.spittingWeight }} Kg
        </template>
      </el-table-column>
      <el-table-column label="收率">
        <template slot-scope="scope">
          {{ scope.row.yield }} %
        </template>
      </el-table-column>
      <el-table-column prop="feedNote" label="说明"></el-table-column>
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
    <el-dialog :title="editDialogTitle" width="60%" :before-close="handleEditDialogClose"
      :visible="editDialogVisible" center>
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号" label-width="100px">
              <el-input v-model="editDialogData.serial" :disabled="disableEditSerial"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="操作人" label-width="60px">
              <el-input v-model="editDialogData.operator"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-form-item label="日期" label-width="50px">
              <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="设备运行状态" label-width="110px">
          <el-input v-model="editDialogData.machineStatus" type="textarea"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="110px" label="料重">
              <el-input v-model="editDialogData.feedWeight">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15" :offset="1">
            <el-form-item label-width="110px" label="投料说明">
              <el-input v-model="editDialogData.feedNote" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="制粉时间" label-width="110px">
              <el-time-picker
                is-range
                v-model="editDialogData.flourDetails.row1.timeRange"
                start-placeholder="制粉起始时间"
                end-placeholder="制粉结束时间"
              ></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="制粉耗时（h）" label-width="150px">
              <el-input disabled :value="hoursBetweenDates"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="制粉起始氧含量" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row2.col1">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="制粉过程氧含量" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row2.col2">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="制粉结束氧含量" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row2.col3">
                <template slot="append">ppm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分选机转速" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row3.col1">
                <template slot="append">rpm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="研磨压力" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row3.col2">
                <template slot="append">Mpa</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="制粉机起始流量" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row4.col1">
                <template slot="append">Nm³</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="制粉机起始流量" label-width="110px">
              <el-input v-model="editDialogData.flourDetails.row4.col2">
                <template slot="append">Nm³</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="料重" label-width="110px">
              <el-input v-model="editDialogData.materialWeight">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="吐料" label-width="110px">
              <el-input v-model="editDialogData.spittingWeight">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="收率" label-width="110px">
              <el-input v-model="getYeild" disabled>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" label-width="110px">
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
      editDialogTitle: "",
      editDialogData: {
        createTime: new Date(),
        flourDetails: {
          row1: {
            timeRange: [new Date(), new Date()]
          },
          row2: {
            col1: "",
            col2: "",
            col3: ""
          },
          row3: {
            col1: "",
            col2: ""
          },
          row4: {
            col1: "",
            col2: ""
          }
        }
      }
    };
  },
  computed: {
    filteredData() {
      let [...data] = this.flourMillingData;
      if (this.searchSerial)
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      // data.forEach(item => {
      //   item.flourDetails = JSON.parse(item.flourDetails);
      //   item.flourDetails.timeRange = [
      //     new Date(Number(item.flourDetails.row1.col1)),
      //     new Date(Number(item.flourDetails.row1.col2))
      //   ];
      // });
      return data;
    },
    hoursBetweenDates() {
      if (this.editDialogData.flourDetails.row1.timeRange) {
        let begin = moment(this.editDialogData.flourDetails.row1.timeRange[0]);
        let end = moment(this.editDialogData.flourDetails.row1.timeRange[1]);
        return `${end.diff(begin) / 3600000} h`;
      }
      return "";
    },
    getYeild() {
      return (
        (this.editDialogData.materialWeight /
          this.editDialogData.feedWeight) *
        100
      );
    },
    ...mapGetters(["flourMillingData"])
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
      await this.$store.dispatch("fetchFlourMillingData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.disableEditSerial = true;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createTime = new Date(this.editDialogData.createTime);
      this.editDialogData.createTime = moment(this.editDialogData.createTime, "YYYY-M-D").toDate();
      this.editDialogData.feedWeight = Number(this.editDialogData.feedWeight);
      this.editDialogData.materialWeight = Number(this.editDialogData.materialWeight);
      console.log(this.editDialogData.flourDetails);
      this.$set(this.editDialogData.flourDetails.row1, "timeRange", [
        new Date(Number(this.editDialogData.flourDetails.row1.col1)),
        new Date(Number(this.editDialogData.flourDetails.row1.col2))
      ]);

      console.log(this.editDialogData);
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增磨粉记录";
      this.disableEditSerial = false;
      this.editDialogData = {
        createTime: new Date(),
        flourDetails: {
          row1: {
            timeRange: [new Date(), new Date()],
          },
          row2: {
            col1: "",
            col2: "",
            col3: ""
          },
          row3: {
            col1: "",
            col2: ""
          },
          row4: {
            col1: "",
            col2: ""
          }
        }
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      this.editDialogData.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      // this.editDialogData.flourDetails = JSON.stringify(this.editDialogData.flourDetails);

      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.flourDetails.row1.col1 = this.editDialogData.flourDetails.row1.timeRange[0].getTime();
      data.flourDetails.row1.col2 = this.editDialogData.flourDetails.row1.timeRange[1].getTime();
      data.flourDetails.row1.col3 = this.hoursBetweenDates;
      delete data.flourDetails.row1.timeRange;
      data.materialWeight = data.feedWeight;
      data.yield = this.getYeild;
      data.createTime = moment(new Date(data.createTime)).format("YYYY-M-D");
      data.flourDetails = JSON.stringify(data.flourDetails);
      await this.$store.dispatch({
        type: "updateFlourMillingData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteFlourMillingDataById",
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
