<template>
    <div>
        data
        <el-row type="flex" justify="space-around" :gutter="20">
            <el-col :span="10">
                <el-input v-model="search.tags[search.tmpTagType]" size="large">
                    <el-select v-model="search.tmpTagType" slot="prepend" placeholder="请选择">
                        <el-option label="名字" value="name"></el-option>
                        <el-option label="地址" value="address"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="12">
                <el-date-picker v-model="search.dateRange" type="daterange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            查询什么呢？
            <el-tag v-for="tag in allTags" :key="tag.type" class="tmp">
                {{`${tag.type}: ${tag.value}`}}
            </el-tag>
        </el-row>
        <el-table 
            v-loading="loading"
            :data="searchResult"
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
import moment from 'moment';
import animate from 'animate.css'
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
                }, {
                    text: '全部',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(0);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            items: [],
            loading: false,
            search: {
                tags: {},
                dateRange: [new Date(0), new Date],
                tmpTagType: 'name',
                tmpTagValue: ''
            },
            inputVisible: false,
        };
    },
    methods: {
        handleTagClose(tag) {
            this.search.tags[tag.type] = '';
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
                date: moment(new Date()).format('YY-MM-DD'),
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
    },
    computed: {
        allTags() {
            let list = [];
            for (let tag in this.search.tags) {
                if (!this.search.tags[tag]) continue;
                list.push({
                    type: tag,
                    value: this.search.tags[tag]
                });
            }
            return list;
        },
        searchResult() {
            let list = [];
            for (let item of this.items) {
                let ok = true;
                let start = moment(this.search.dateRange[0]);
                let end = moment(this.search.dateRange[1]);
                for (let tag in this.search.tags) {
                    let now = moment(item.date, 'YY-MM-DD');                    
                    if (!item[tag].match(this.search.tags[tag]) ||
                            now.isBefore(start) || now.isAfter(end)) {
                        ok = false;
                        console.log(this.search.tags[tag].match(item[tag]));
                        console.log(item[tag]);
                        break;
                    }
                }
                if (ok) list.push(item);
            }
            return list;
        }
    }
}
</script>

<style>
.el-select .el-input {
    width: 130px !important;
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
    margin-left: 10px;
    vertical-align: bottom;
}

.tmp {
    transition: all 1s ease;
}
</style>