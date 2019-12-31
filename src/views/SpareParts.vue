<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增备料记录</el-button>
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
          <el-table :data="props.row.data">
            <el-table-column prop="composition" label="成分"></el-table-column>
            <el-table-column prop="requirementWeight" label="需求量"></el-table-column>
            <el-table-column prop="ingredientsWeigth" label="配料量"></el-table-column>
            <el-table-column prop="note" label="重要原料备注"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="serial" label="编号"></el-table-column>
      <el-table-column prop="createTime" label="日期"></el-table-column>
      <el-table-column prop="compositeOperator" label="配料人"></el-table-column>
      <el-table-column prop="ingredientOperator" label="复合人"></el-table-column>
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
    <el-dialog :title="editDialogTitle" width="30%" :before-close="handleEditDialogClose" :visible="editDialogVisible"
      center>
      <el-form :model="editDialogData">
        <el-form-item label="编号">
          <el-input v-model="editDialogData.serial" :disabled="disableEditSerial"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="editDialogData.createTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="配料人">
          <el-input v-model="editDialogData.compositeOperator"></el-input>
        </el-form-item>
        <el-form-item label="复合人">
          <el-input v-model="editDialogData.ingredientOperator"></el-input>
        </el-form-item>
        <el-button type="primary" @click="editDialogData.data.push({})">增加原料</el-button>
        <el-card style="margin-top: 0.3rem" v-for="(dataItem, idx) in editDialogData.data" :key="idx">
          <div slot="header" class="clearfix">
            <el-button style="float: right" size="mini" type="danger" @click="editDialogData.data.splice(idx, 1)">删除</el-button>
          </div>
          <el-form-item label="成分">
            <el-select v-model="dataItem.composition">
              <el-option
                v-for="option in stockOptions"
                :key="option.stockName"
                :label="option.stockName"
                :value="option.stockName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求量">
            <el-input v-model="dataItem.requirementWeight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="配料量">
            <el-input v-model="dataItem.ingredientsWeigth" type="number"></el-input>
          </el-form-item>
          <el-form-item label="重要原料备注">
            <el-input v-model="dataItem.note" type="textarea"></el-input>
          </el-form-item>
        </el-card>
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
        data: []
      }
    };
  },
  computed: {
    filteredData() {
      if (this.searchSerial)
        return this.sparePartsData.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      return this.sparePartsData;
    },
    ...mapGetters(["sparePartsData", "stockOptions"])
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
      await this.$store.dispatch("fetchSparePartsData");
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
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增备料记录";
      this.disableEditSerial = false;
      this.editDialogData.createTime = new Date();
      this.editDialogData = {
        data: [],
        createTime: new Date()
      };
      this.editDialogData.data = [];
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      await this.$store.dispatch({
        type: "deleteSparePartsDataBySerial",
        data: this.editDialogData.serial
      });
      this.editDialogData.createTime = moment(this.editDialogData.createTime).format("YYYY-M-D");
      this.editDialogData.data.forEach(item => {
        item.serial = this.editDialogData.serial;
        item.createTime = this.editDialogData.createTime;
        item.compositeOperator = this.editDialogData.compositeOperator;
        item.ingredientOperator = this.editDialogData.ingredientOperator;
        item.id = "";
      });
      await this.$store.dispatch({
        type: "insertSparePartsData",
        data: this.editDialogData
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteSparePartsDataBySerial",
        data: row.serial
      });
      this.loading = false;
    }
  }
};
</script>
