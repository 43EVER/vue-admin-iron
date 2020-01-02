<template>
  <div class="stock" v-loading="loading">
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="handleCreate">新增产品</el-button>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入要搜索的编号" v-model="searchSerial">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="filteredData">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <div v-for="(item, idx) in row.detectionInfo" :key="idx" style="width: 50%">
            <el-image
              style="width: 30%"
              :src="item.url"
              :preview-src-list="[item.url]"
            >

            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serial" label="原料名称"></el-table-column>
      <el-table-column prop="amount" label="数量"></el-table-column>
      <el-table-column prop="amount2" label="剩余数量"></el-table-column>
      <el-table-column prop="details" label="细节"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popover :ref="'popover' + scope.$index">
            <p>确定删除 {{ scope.row.stockName }} 吗？</p>
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
          <el-input v-model="editDialogData.serial"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editDialogData.amount"></el-input>
        </el-form-item>
        <el-form-item label="细节">
          <el-input v-model="editDialogData.details"></el-input>
        </el-form-item>
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="true"
          :on-success="handleUploadImagesSuccess"
          :http-request="uploadImage"
          :file-list="editDialogData.detectionInfo"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
            <span
              v-if="true"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            ><i class="el-icon-delete"></i></span>
              </span>
          </div>
        </el-upload>
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
      searchSerial: "",
      loading: true,
      editDialogVisible: false,
      editDialogTitle: "",
      editDialogData: {
        detectionInfo: []
      },
      disabled: false
    };
  },
  computed: {
    filteredData() {
      let data = JSON.parse(JSON.stringify(this.productData));
      data.forEach(item => {
        if (item.detectionInfo) item.detectionInfo = JSON.parse(item.detectionInfo);
      });
      if (this.searchSerial)
        data = data.filter(item => {
          if (item.serial.indexOf(this.searchSerial) !== -1) return true;
          return false;
        });
      return data;
    },
    ...mapGetters(["productData"])
  },
  created() {
    this.fetch();
  },
  methods: {
    getURLList(row) {
      let data = [];
      row.forEach(item => {
        data.push(item.url);
      });
    },
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
      await this.$store.dispatch("fetchProductData");
      this.loading = false;
    },
    handleEdit(row) {
      this.editDialogVisible = true;
      this.editDialogTitle = "编辑 " + row.serial;
      this.editDialogData = JSON.parse(JSON.stringify(row));
      // console.log("handle edit ");
      // console.log(this.editDialogData);
    },
    handleCreate() {
      this.editDialogVisible = true;
      this.editDialogTitle = "新增产品";
      this.editDialogData = {
        detectionInfo: []
      };
    },
    async submitDialogData() {
      this.loading = true;
      this.editDialogVisible = false;
      let data = JSON.parse(JSON.stringify(this.editDialogData));
      data.detectionInfo = [];
      this.editDialogData.detectionInfo.forEach(item => {
        data.detectionInfo.push({
          url: item.url
        });
      });
      data.detectionInfo = JSON.stringify(data.detectionInfo);
      // console.log(data);
      await this.$store.dispatch({
        type: "updateProductData",
        data: data
      });
      this.loading = false;
    },
    async handleDelete(row, index) {
      this.closeDeletePopover(index);
      this.loading = true;
      await this.$store.dispatch({
        type: "deleteProductDataById",
        data: row.id
      });
      this.loading = false;
    },
    handleUploadImagesSuccess(res, file, fileList) {
      this.editDialogData.detectionInfo = fileList;
      file.url = res;
    },
    handleRemove(file) {
      this.editDialogData.detectionInfo = this.editDialogData.detectionInfo.filter(item => {
        if (item.url !== file.url) return true;
        return false;
      });
    },
    async uploadImage(params) {
      let formData = new FormData();
      formData.append("upload", params.file);
      const res = await this.$http.post("/api/fileupload", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return `http://localhost:8080/web_war_exploded/uploads/${res.data.data.ImageName}`;
    }
  }
};
</script>
