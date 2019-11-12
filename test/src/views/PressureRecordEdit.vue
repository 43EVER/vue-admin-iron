<template>
    <div>
        <h1>{{id ? "编辑" : "新建"}}压型记录</h1>
        <el-form label-width="5rem" @submit.native.prevent="save" v-loading="loading">
            <el-row class="">
                <el-col :span="6">
                    <el-form-item label="编号">
                        <el-input v-model="model.number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="压机编号">
                        <el-input v-model="model.pressNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建日期">
                        <el-date-picker v-model="model.createTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="毛胚数量">
                        <el-input v-model="model.roughcastNumber">
                            <template slot="append">块</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="领料">
                        <el-input v-model="model.picking"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="产品单重">
                        <el-input v-model="model.singleProduct"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="模具编号">
                        <el-input v-model="model.toolsNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="模具尺寸">
                        <el-input v-model="model.toolsSize">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-card>
                    <el-collapse>
                        <el-collapse-item name="1">
                            <template slot="title">
                                <span class="fs-3 fc-primary">参数</span>
                            </template>
                            <el-card class="card-item">
                                <div slot="header">
                                    <span>压制</span>
                                </div>
                                <el-col :span="6">
                                    <el-form-item label="压力">
                                        <el-input v-model="model.suppressPressure"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="时间">
                                        <el-input v-model="model.suppressTime"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-card>
                            <el-card class="card-item">
                                <div slot="header">
                                    <span>充磁</span>
                                </div>
                                <el-col :span="6">
                                    <el-form-item label="电流">
                                        <el-input v-model="model.magnetizingCurrent"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="时间">
                                        <el-input v-model="model.magentizingTime"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-card>
                            <el-card class="card-item">
                                <div slot="header">
                                    <span>退磁</span>
                                </div>
                                <el-col :span="6">
                                    <el-form-item label="电流">
                                        <el-input v-model="model.demagnetizationCurrent"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="时间">
                                        <el-input v-model="model.demagnetizatioTime"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-card>
                            <el-card class="card-item">
                                <div slot="header">
                                    <span>氧含量</span>
                                </div>
                                <el-col :span="6">
                                    <el-form-item label="称料室">
                                        <el-input v-model="model.oxygenWeighingRoom"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="包装室">
                                        <el-input v-model="model.oxygenPackingRoom"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-row>
            <el-row class="mt-1">
                <el-button icon="el-icon-plus" @click="model.items.push({})">添加胚尺寸</el-button>
            </el-row>
            <el-row>
                <el-card class="card-item">
                    <el-row v-for="(item, idx) in model.items" :key="idx">
                        <el-col :span="1">
                            <el-button icon="el-icon-close" class="fc-red" @click="removeItem(idx)"></el-button>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="序号">
                                <el-input v-model="item.number" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="压制">
                                <el-input v-model="item.suppress" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="模宽">
                                <el-input v-model="item.modeWidth" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="取向">
                                <el-input v-model="item.orientation" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-row>
            <el-row class="mt-1">
                <el-col :span="6">
                <el-form-item label="氮气量（开始）" label-width="8rem">
                    <el-input v-model="model.starNitrogen"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item label="氮气量（结束）" label-width="8rem">
                    <el-input v-model="model.endNitrogen"></el-input>
                </el-form-item>
                </el-col>
            </el-row>
            <el-row class="mt-1">
                <el-col :span="6">
                    <el-form-item label="操作人" label-width="8rem">
                        <el-input v-model="model.operator"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="mt-1">
                <el-col :span="10">
                    <el-form-item label="备注" label-width="8rem">
                        <el-input v-model="model.remarks" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="mt-1">
                <el-button type="primary" @click="save">保存</el-button>
            </el-row>
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
            model: {
                items: []
            },
            loading: false,
            itemProps: {},
        }
    },
    methods: {
        async save() {
            this.loading = true;
            this.model.createTime = this.model.createTime.getTime();
            let tmp = {};
            for (let prop in this.model) {
                if (prop == 'items') continue;
                tmp[prop] = this.model[prop];
            }
            console.log(tmp);
            let res = {};
            if (this.id) {
                res = await this.$http.put(`/updatePressureRecord`, tmp);
            } else {
                res = await this.$http.post('/insertPressureRecord', tmp);
            }
            console.log(res.data);
            for (let idx in this.model.items) {
                console.log(this.model.items[idx]);
                let tmpRes = await this.$http.post('/insertBlankSize', this.model.items[idx]);
                console.log(`tmpRes: ${tmpRes}`);
                // TODO: 插入关系
                // tmpRes = await this.$http.post('/')
            }
            this.loading = false;
            this.$router.push('/pressurerecord/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async removeItem(idx) {
            if (this.model.items[idx].id) {
                // TODO: 删除关系和 blankSize
                await this.$http.delete(`/deleteBlankSize/${this.model.items[idx].id}`);
                const tmp = {
                    "id1": Number(this.model.id),
                    "id2": Number(this.model.items[idx].id)
                };
                console.log(tmp);
                await this.$http.delete(`/deleteRelationPressureAndBlank/${this.model.id}/${this.model.items[idx].id}`);
            }
            this.model.items.splice(idx, 1);
        },

        async fetch() {
            this.loading = true;
            const res = await this.$http.get(`PressureRecord/${this.id}`);
            console.log(res.data);
            this.model = res.data.data.pressureRecord;
            this.model.createTime = new Date(Number(this.model.createTime));
            this.$set(this.model, 'items', []);
            const relationRes = await this.$http.get('/getAllRelationDieAndBlank');
            const relation = relationRes.data.data.relationshipDieAndBlank;
            for (let idx in relation) {
                if (this.model.id === relation[idx].pressureRecordId) {
                    console.log(relation[idx].blankSizeId);
                    const itemRes = await this.$http.get(`getBlankSizeById/${relation[idx].blankSizeId}`);
                    console.log(itemRes.data.data.blankSize);
                    this.model.items.push(itemRes.data.data.blankSize);
                }
            }
            this.loading = false;

            // // const res = await this.$http.get(`rest/categories/${this.id}`);
            // // this.model = res.data;
            // this.loading = true;
            // const res = await this.$http.get(`/getSparePartsByCode/${this.brandName}`);
            // // this.model = res.data.data.spareParts;
            // // this.model.createTime = new Date(Number(this.model.createTime));
            // // console.log(this.model.createTime);
            // console.log(res.data);
            // this.model.items = res.data.data.getSparePartsByCode;
            // this.model.createTime = new Date(Number(this.model.items[0].createTime));
            // this.model.ingredientPerson = this.model.items[0].ingredientPerson;
            // this.model.reviewer = this.model.items[0].reviewer;
            // this.model.brandName = this.model.items[0].brandName;
            // this.loading = false;
        },
    },

    created() {
        if (this.id) this.fetch();
    }
}
</script>

<style>
.mt-1 {
    margin-top: 1rem;
}

.fc-red {
    color: red !important;
}

.d-flex {
    display: flex;
}

.jc-end {
    justify-content: flex-end;
}

.card-item {
    margin-top: 1rem;
}

.fc-primary {
    color: #303133;
}

.fs-3 {
    font-size: 1.3rem;
}
</style>