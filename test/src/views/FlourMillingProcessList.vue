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
            :data="items"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item v-for="(value, key) in itemProps" :key="key" :label="value">
                            <span>{{ props.row[key] }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column v-for="(value, key) in simpleItemProps" :key="key" :prop="key" :label="value">
            </el-table-column>
            <el-table-column align="right" min-width="90rem">
                <template slot-scope="scope">
                    <el-button size="mini" @click="$router.push(`/flourmillingprocess/edit/${scope.row.id}`)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
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
            inputVisible: false,
            tmpItem: {},
            itemProps: {
                id: 'ID',
                number: '编号',
                operator: '操作人',
                createTime: '创建日期',
                operationOfEquipment: '设备运行情况',
                feedWeight: '料重(Kg)',
                feedInstructions: '投料说明',
                millingStarTime: '制粉起始时间',
                millingEndTime: '制粉结束时间',
                millingTime: '制粉耗时(h)',
                starOxygenContent: '制粉起始氧含量(ppm)',
                processOxygenContent: '制粉过程氧含量(ppm)',
                endOxygenContent: '制粉结束氧含量(ppm)',
                speed: '分选机转速(rpm)',
                grindPressure: '研磨压力(Mpa)',
                millingStarFlow: '制粉起始流量(Nm³)',
                millingEndFlow: '制粉终止流量(Nm³)',
                materialWeight: '料重(Kg)',
                spitting: '吐料(Kg)',
                yield: '收率(%)',
                remarks: "备注"
            },
            simpleItemProps: {
                number: '编号',
                operator: '操作人',
                createTime: '创建日期',
            }
        };
    },
    methods: {
        handleTagClose(tag) {
            console.log(tag);
            this.search.tags[tag.type] = '';
        },
        async fetch() {
            this.loading = true;
            const res = await this.$http.get('/getAllFlourMillingProcessRecord');
            console.log()
            this.rawItems = res.data.data.FlourMillingProcessRecord;
            this.rawItems.map(v => {
                v.createTimeRaw = new Date(Number(v.createTime));
                const tmp = moment(v.createTimeRaw);
                v.createTime = tmp.format('YY年M月D号, hh:mm:ss');
                return v;
            });
            this.loading = false;
            this.updateBySearch();
        },
        async handleDelete(index, row) {
            this.$confirm(`是否确定删除 "${row.id}"`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`deleteFlourMillingProcessRecords/${row.id}`);
                console.log(res);
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
        },
        async updateBySearch() {
            let list = [];
            const start = moment(this.search.dateRange[0]);
            const end = moment(this.search.dateRange[1]);
            for (let idx in this.rawItems) {
                let item = this.rawItems[idx];
                let ok = true;
                const now = moment(item.createTimeRaw);
                if (now.isBefore(start) || now.isAfter(end)) continue;
                for (let key in this.search.tags) {
                    if (!String(item[key]).match(this.search.tags[key])) {
                        ok = false;
                        break;
                    }
                }
                if (ok) list.push(item);
            }
            this.items = list;
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

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 40%;
}

.table-expand label {
    width: 10rem;
    color: #99a9bf;
}

.mt-1 {
    margin-top: 0.33rem;
}
</style>