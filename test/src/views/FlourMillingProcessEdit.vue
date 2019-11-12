<template>
    <div>
        <h1>{{id ? "编辑" : "新建"}}制粉工艺记录</h1>
        <el-form label-width="7rem" @submit.native.prevent="save" v-loading="loading">
            <el-collapse>
                <el-collapse-item name="1" title="基础信息">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="编号">
                                <el-input v-model="model.number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="操作人">
                                <el-input v-model="model.operator"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="创建日期">
                                <el-date-picker v-model="model.createTime" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="设备运行情况">
                            <el-input v-model="model.operationOfEquipment" type="textarea"></el-input>
                        </el-form-item>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item name="2" title="投料信息">
                    <el-row type="flex" justify="left" align="center">
                        <el-col :span="6">
                            <el-form-item label="料重">
                                <el-input v-model="model.feedWeight">
                                    <template slot="append">Kg</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="说明">
                                <el-input v-model="model.feedInstructions" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
                <el-collapse-item name="3" title="气流制粉信息">
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>时间</span>
                        </div>
                        <el-row type="flex" justify="left">
                            <el-col :span="8">
                                <el-form-item label="制粉起始时间">
                                    <el-input v-model="model.millingStarTime"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="制粉结束时间">
                                    <el-input v-model="model.millingEndTime"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="制粉耗时">
                                    <el-input v-model="model.millingTime">
                                        <template slot="append">h</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>氧含量</span>
                        </div>
                        <el-row type="flex" justify="left">
                            <el-col :span="8">
                                <el-form-item label="制粉起始氧含量">
                                    <el-input v-model="model.starOxygenContent">
                                        <template slot="append">ppm</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="制粉过程氧含量">
                                    <el-input v-model="model.processOxygenContent">
                                        <template slot="append">ppm</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="制粉结束氧含量">
                                    <el-input v-model="model.endOxygenContent">
                                        <template slot="append">ppm</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>参数</span>
                        </div>
                        <el-row type="flex" justify="left">
                            <el-col :span="8">
                                <el-form-item label="分选机转速">
                                    <el-input v-model="model.speed">
                                        <template slot="append">rpm</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="研磨压力">
                                    <el-input v-model="model.grindPressure">
                                        <template slot="append">Mpa</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>耗气量</span>
                        </div>
                        <el-row type="flex" justify="left">
                            <el-col :span="8">
                                <el-form-item label="制粉起始流量">
                                    <el-input v-model="model.millingStarFlow">
                                        <template slot="append">Nm³</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="制粉终止流量">
                                    <el-input v-model="model.millingEndFlow">
                                        <template slot="append">Nm³</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>出料</span>
                        </div>
                        <el-row type="flex" justify="left">
                            <el-col :span="8">
                                <el-form-item label="料重">
                                    <el-input v-model="model.materialWeight">
                                        <template slot="append">Kg</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="吐料">
                                    <el-input v-model="model.spitting">
                                        <template slot="append">Kg</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="收率">
                                    <el-input v-model="model.yield">
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="el-card-item">
                        <div slot="header">
                            <span>备注</span>
                        </div>
                        <el-form-item label="备注">
                            <el-input v-model="model.remarks" type="textarea">
                            </el-input>
                        </el-form-item>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        id: {}
    },

    data() {
        return {
            model: {},
            loading: false,
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
        }
    },

    methods: {
        async save() {
            this.loading = true;
            console.log(this.model.createTime);
            this.model.createTime = this.model.createTime.getTime();
            let res;
            if (this.id) {
                res = await this.$http.put(`/updateFlourMillingProcessRecord`, this.model);
            } else {
                console.log(this.model);
                res = await this.$http.post(`/insertFlourMillingProcessRecords`, this.model);
            }
            this.loading = false;
            this.$router.push('/flourmillingprocess/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async fetch() {
            this.loading = true;
            const res = await this.$http.get(`/getFlourMillingProcessRecordById/${this.id}`);
            this.model = res.data.data.flourMillingProcessRecord;
            this.model.createTime = new Date(Number(this.model.createTime));
            console.log(this.model.createTime);
            this.loading = false;
        },
    },
    created() {
        if (this.id) this.fetch();
        for (let prop in this.itemProps) {
            this.$set(this.model, prop, '');
        }
        this.model.createTime = new Date();
    }
}
</script>

<style>
.form-item-title-1 {
    font-size: 1.5rem;
    color: #606266;
}

.form-item-title-2 {
    font-size: 1.1rem;
    color: #606266;
}

.el-card-item {
    margin-top: 1rem;
}
</style>