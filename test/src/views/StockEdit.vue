<template>
    <div>
        <h1>{{id ? "编辑" : "新建"}}库存记录</h1>
        <el-form label-width="7rem" @submit.native.prevent="save" v-loading="loading">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="名称">
                        <el-input v-model="model.stockName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位">
                        <el-input v-model="model.company"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="创建日期">
                        <el-date-picker v-model="model.createTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="期初">
                        <el-input v-model="model.initialStage">
                                <template slot="append">{{model.company}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="增加">
                        <el-input v-model="model.increase">
                                <template slot="append">{{model.company}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="减少">
                        <el-input v-model="model.reduce">
                                <template slot="append">{{model.company}}</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="重量">
                        <el-input v-model="model.weight">
                                <template slot="append">{{model.company}}</template>

                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
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
                stockName: '名称',
                company: '单位',
                createTime: '创建日期',
                initialStage: '期初',
                increase: '增加',
                reduce: '减少',
                weight: '重量',
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
                res = await this.$http.put(`/updateStock`, this.model);
            } else {
                console.log(this.model);
                res = await this.$http.post(`/insertStock`, this.model);
            }
            this.loading = false;
            this.$router.push('/stock/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async fetch() {
            this.loading = true;
            const res = await this.$http.get(`/getStockById/${this.id}`);
            this.model = res.data.data.stock;
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