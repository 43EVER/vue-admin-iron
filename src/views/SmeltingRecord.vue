<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增冶炼操作记录</el-button>
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
          <el-table :data="props.row.smeltingDetails" border>
            <el-table-column prop="col1" label="操作步骤"></el-table-column>
            <el-table-column label="时间">
              <template slot-scope="scope">
                {{ scope.row.col2 | dateToTime }}
              </template>
            </el-table-column>
            <el-table-column prop="col3" label="真空度（Pa）"></el-table-column>
            <el-table-column prop="col4" label="加热功率（Kw）"></el-table-column>
            <el-table-column prop="col5" label="温度（℃）"></el-table-column>
            <el-table-column prop="col6" label="水流量（L/Min）"></el-table-column>
            <el-table-column prop="col7" label="水温（℃）"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="createTime" label="记录日期"></el-table-column>
      <el-table-column prop="operator" label="操作人员"></el-table-column>
      <el-table-column label="原料总重">
        <template slot-scope="scope"> {{ scope.row.feedWeight }} Kg </template>
      </el-table-column>
      <el-table-column label="中间包料重">
        <template slot-scope="scope"> {{ scope.row.midWeight }} Kg </template>
      </el-table-column>
      <el-table-column label="该坩埚使用炉次">
        <template slot-scope="scope"> 第 {{ scope.row.crucibleCount }} 炉 </template>
      </el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
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
    <el-dialog :title="editDialogTitle" :before-close="handleEditDialogClose" :visible="editDialogVisible"
      center>
      <el-form :model="editDialogData" label-width="110px">

        <el-row>
          <el-col :span="10">
            <el-form-item label="编号">
              <el-input v-model="editDialogData.serial" :disabled="disableEditSerial"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="记录日期">
              <el-date-picker v-model="editDialogData.createTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="操作人员">
          <el-input v-model="editDialogData.operator"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="原料总重">
              <el-input v-model="editDialogData.feedWeight">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="中间包料重">
              <el-input v-model="editDialogData.midWeight">
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="该坩埚使用炉次">
              <el-input v-model="editDialogData.crucibleCount">
                <template slot="prepend">第</template>
                <template slot="append">炉</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="editDialogData.note" type="textarea"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[0].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[0].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[0].col6" placeholder="水流量">
                <template slot="append">L/Min</template>
              </el-input>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[0].col7" placeholder="水温">
                <template slot="append">℃</template>
              </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[1].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[1].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[2].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[2].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[2].col3" placeholder="真空度">
                <template slot="append">Pa</template>
              </el-input>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[2].col4" placeholder="加热功率">
                <template slot="append">KW</template>
              </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[3].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[3].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[3].col3" placeholder="真空度">
                <template slot="append">Pa</template>
              </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[4].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[4].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[4].col3" placeholder="真空度">
                <template slot="append">Pa</template>
              </el-input>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[4].col4" placeholder="加热功率">
                <template slot="append">KW</template>
              </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[5].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[5].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
              <el-input type="number" v-model="editDialogData.smeltingDetails[5].col4" placeholder="加热功率">
                <template slot="append">KW</template>
              </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[6].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[6].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[7].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[7].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input v-model="editDialogData.smeltingDetails[7].col5" placeholder="温度">
              <template slot="append">℃</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[8].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[8].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input v-model="editDialogData.smeltingDetails[8].col5" placeholder="温度">
              <template slot="append">℃</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[9].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[9].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input v-model="editDialogData.smeltingDetails[9].col5" placeholder="温度">
              <template slot="append">℃</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[10].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[10].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input type="number" v-model="editDialogData.smeltingDetails[10].col6" placeholder="水流量">
              <template slot="append">L/Min</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[11].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[11].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input type="number" v-model="editDialogData.smeltingDetails[11].col6" placeholder="水流量">
              <template slot="append">L/Min</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[12].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[12].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[13].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[13].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[14].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[14].col2" placeholder="时间"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="editDialogData.smeltingDetails[15].col1">
              <el-time-picker v-model="editDialogData.smeltingDetails[15].col2" placeholder="时间"></el-time-picker>
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
        smeltingDetails: [
          { col1: "泵1开" },
          { col1: "泵2开" },
          { col1: "烘料" },
          { col1: "充氮气" },
          { col1: "开始熔炼" },
          { col1: "达到180KW" },
          { col1: "全熔" },
          { col1: "第一次测温" },
          { col1: "第二次测温" },
          { col1: "第三次测温" },
          { col1: "浇筑开始" },
          { col1: "浇筑结束" },
          { col1: "充氮开始" },
          { col1: "充氮结束" },
          { col1: "风冷开始" },
          { col1: "风冷结束" }
        ]
      }
    };
  },
  computed: {
    filteredData() {
      let [...data] = this.smeltingRecordData;
      if (this.searchSerial) {
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      }
      data.forEach(item => {
        item.smeltingDetails.forEach(subItem => {
          subItem.col2 = new Date(Number(subItem.col2));
        })
      })
      return data;
    },
    ...mapGetters(["smeltingRecordData"])
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
      await this.$store.dispatch("fetchSmeltingRecordData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.disableEditSerial = true;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      this.editDialogData.createTime = moment(
        row.createTime,
        "YYYY-M-D"
      ).toDate();
      this.editDialogData.smeltingDetails.forEach(item => {
        item.col2 = new Date(item.col2);
      });
      console.log(this.editDialogData);
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增冶炼操作记录";
      this.disableEditSerial = false;
      this.editDialogData.createTime = new Date();
      this.editDialogData = {
        smeltingDetails: [
          { col1: "泵1开" },
          { col1: "泵2开" },
          { col1: "烘料" },
          { col1: "充氮气" },
          { col1: "开始熔炼" },
          { col1: "达到180KW" },
          { col1: "全熔化" },
          { col1: "第一次测温" },
          { col1: "第二次测温" },
          { col1: "第三次测温" },
          { col1: "浇筑开始" },
          { col1: "浇筑结束" },
          { col1: "充氮开始" },
          { col1: "充氮结束" },
          { col1: "风冷开始" },
          { col1: "风冷结束" }
        ],
        createTime: new Date()
      };
      this.editDialogData.smeltingDetails.forEach(item => {
        item.col2 = new Date();
      });
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      this.editDialogData.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      this.editDialogData.smeltingDetails.forEach(item => {
        item.col2 = item.col2.getTime();
      });
      this.editDialogData.smeltingDetails = JSON.stringify(this.editDialogData.smeltingDetails);
      await this.$store.dispatch({
        type: "updateSmeltingRecordData",
        data: this.editDialogData
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteSmeltingRecordDataById",
        data: row.id
      });
      this.loading = false;
    }
  }
};
</script>
