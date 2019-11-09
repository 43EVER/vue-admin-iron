<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-date-picker v-model="search.dateRange" type="daterange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-tag
            v-for="(tag, idx) in search.tags" :key="idx"
            @close="handleClose(idx)"
            closable>
            {{tag.type + '=' + tag.value}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            <el-select v-model="tmpTagType" slot="prepend" placeholder="请选择">
                <el-option label="name" value="name"></el-option>
                <el-option label="address" value="address"></el-option>
            </el-select>
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        <el-table 
            v-loading="loading"
            :data="items"
            style="width: 100%">
            <el-table-column label="Date" prop="date">
            </el-table-column>
            <el-table-column label="Name" prop="name">
            </el-table-column>
            <el-table-column label="Address" prop="address">
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="$router.push(`/data/edit/${scope.row.id}`)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            items: [],
            loading: false,
            search: {
                tags: [{ type: 'name', value: '刘洋' }],
                dateRange: [new Date(), new Date],
                tmpTagType: 'name',
                tmpTagValue: ''
            },
            inputVisible: false,
        };
    },
    methods: {
        handleClose(idx) {
            this.search.tags.splice(idx, 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let tmp = {};
            tmp.type = this.search.tmpTagType;
            tmp.value = this.search.tmpTagValue;
            if (tmp.value) {
                this.search.tags.push(tmp);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        async fetch() {
            this.loading = true;
            await new Promise((resolve, reject)=>{
                setTimeout(() => {
                    resolve();
                }, 500);
            });
            this.items = new Array(5).fill({
                name: '刘洋',
                date: '1999-01-04',
                address: '内蒙古科技大学',
                id: 'test'
            });
            this.loading = false;
        },
        handleDelete(index, row) {
            this.$confirm(`是否确定删除 "${row.name}"`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
            //   const res = await this.$http.delete(`rest/items/${row._id}`);
            //   console.log(res);
                await this.fetch();
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }, async() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });
            });
        }
    },
    created() {
        this.fetch();
    }
}
</script>

<style>
.el-select {
    width: 130px;
}
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px !important;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>