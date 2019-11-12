<template>
    <div>
        <el-row type="flex" justify="space-around" :gutter="20">
            <el-col :span="10">
                <el-input v-model="search.tags[search.tmpTagType]" size="large">
                    <el-select v-model="search.tmpTagType" slot="prepend" placeholder="请选择">
                        <el-option v-for="(value, key) in itemProps" :key="key" :label="value" :value="key"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="updateBySearch"></el-button>
                </el-input>
            </el-col>
            <el-col :span="12" class="mt-1">
                <el-date-picker v-model="search.dateRange" type="daterange" align="right" unlink-panels range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-tag v-for="(tag) in allTags" :key="tag.type" closable @close="handleTagClose(tag)">
                {{`${tag.type}: ${tag.value}`}}
            </el-tag>
        </el-row>
        <el-table
            v-loading="loading"
            :data="integratedData"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-form>
                        <el-col :span="8" v-for="(value, key) in itemProps" :key="key">
                            <el-form-item :prop="key" :label="value">
                                <span>{{ scope.row[key] }}</span>
                            </el-form-item>
                        </el-col>
                    </el-form>
                    <el-table :data="scope.row.items">
                        <el-table-column label="序号" prop="number"></el-table-column>
                        <el-table-column label="压制" prop="suppress"></el-table-column>
                        <el-table-column label="模宽" prop="modeWidth"></el-table-column>
                        <el-table-column label="取向" prop="orientation"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column v-for="(value, key) in simpleItemProps" :key="key" :prop="key" :label="value">
            </el-table-column>
            <el-table-column align="right" min-width="90rem">
                <template slot-scope="scope">
                    <el-button size="mini" @click="$router.push(`/pressurerecord/edit/${scope.row.id}`)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import moment from 'moment';

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
            rawItems: [],
            items: [],
            loading: false,
            search: {
                tags: {},
                dateRange: [new Date(0), new Date((new Date()).getTime() + 86400000)],
                tmpTagType: 'id',
                tmpTagValue: ''
            },
            itemProps: {
                id: 'ID',
                number: '编号',
                pressNumber: '压机编号',
                createTime: '创建日期',
                roughcastNumber: '毛胚数量（块）',
                picking: '领料',
                singleProduct: '产品单重',
                toolsNumber: '模具编号',
                toolsSize: '模具尺寸',
                suppressPressure: '压制压力',
                suppressTime: '压制时间',
                magnetizingCurrent: '充磁电流',
                magentizingTime: '充磁时间',
                demagnetizationCurrent: '退磁电流',
                demagnetizatioTime: '退磁时间',
                oxygenWeighingRoom: '称料室氧含量',
                oxygenPackingRoom: '包装室氧含量',
                starNitrogen: '氮气量（开始）',
                endNitrogen: '氮气量（结束）',
                operator: '制作人',
                remarks: '备注',
            },
            simpleItemProps: {
                number: '编号',
                createTime: '创建日期',
                pressNumber: '压机编号',
                operator: '制作人',
                remarks: '备注',
            },
            integratedData: []
        };
    },
    methods: {
        handleTagClose(tag) {
            console.log(tag);
            this.search.tags[tag.type] = '';
        },
        async fetch() {
            this.loading = true;
            const res = await this.$http.get('/getAllPressureRecord');
            this.rawItems = res.data.data.pressureRecords;
            this.rawItems.map(v => {
                v.createTimeRaw = new Date(Number(v.createTime));
                const tmp = moment(v.createTimeRaw);
                v.createTime = tmp.format('YY年M月D号, hh:mm:ss');
                return v;
            });
            this.loading = false;
            this.updateBySearch();
        },
        async handleDelete(row) {
            // console.log(row.brandName);
            // this.$confirm(`是否确定删除 "${row.brandName}"`, '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(async () => {
            //     this.loading = true;
            //     for (let idx in this.rawItems) {
            //         let item = this.rawItems[idx];
            //         if (item.brandName === row.brandName) {
            //             await this.$http.delete(`/deletePressureRecord/${item.id}`);
            //         }
            //     }
            //     await this.fetch();
            //     this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //     });
            // }, async() => {
            //     this.$message({
            //         type: 'info',
            //         message: '取消删除'
            //     });
            // });
        },
        async updateBySearch() {
            console.log(this.rawItems);
            this.items = this.rawItems;
            // let list = [];
            // const start = moment(this.search.dateRange[0]);
            // const end = moment(this.search.dateRange[1]);
            // for (let idx in this.rawItems) {
            //     let item = this.rawItems[idx];
            //     let ok = true;
            //     const now = moment(item.createTimeRaw);
            //     if (now.isBefore(start) || now.isAfter(end)) continue;
            //     for (let key in this.search.tags) {
            //         if (!String(item[key]).match(this.search.tags[key])) {
            //             ok = false;
            //             break;
            //         }
            //     }
            //     if (ok) list.push(item);
            // }
            // this.items = list;
        }
    },
    created() {
        this.fetch();
    },

    watch: {
        items() {
            this.integratedData = this.items;
            // let res = {};
            // this.items.forEach(item => {
            //     console.log(item.brandName);
            //     if (res[item.brandName] === undefined) {
            //         res[item.brandName] = {};
            //         res[item.brandName].brandName = item.brandName;
            //         res[item.brandName].remarks = item.remarks;
            //         res[item.brandName].ingredientPerson = item.ingredientPerson;
            //         res[item.brandName].reviewer = item.reviewer;
            //         res[item.brandName].items = [];
            //         res[item.brandName].createTime = item.createTime;
            //     }
            //     res[item.brandName].items.push(item);
            // });
            // this.integratedData = [];
            // for (let key in res) {
            //     this.integratedData.push(res[key]);
            // }
        }
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

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.mt-1 {
    margin-top: 0.33rem;
}
</style>