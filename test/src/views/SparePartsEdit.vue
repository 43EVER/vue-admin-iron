<template>
    <div>
        <h1>{{id ? "编辑" : "新建"}}物品</h1>
        <el-form label-width="120px" @submit.native.prevent="save"
            v-loading="loading">
            <el-form-item v-for="(value, key) in itemProps" :key="key" :label="value">
                <el-date-picker
                    v-model="model[key]"
                    type="date"
                    placeholder="选择日期"
                    v-if="key==='createTime'">
                </el-date-picker>
                <el-button type="primary"
                        v-if="key==='createTime'"
                        @click="model.createTime=new Date()">现在</el-button>
                <el-input v-model="model[key]" v-else></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
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
                component: '组件',
                requirement: '需要',
                dosage: '剩余',
                remarks: '标记',
                createTime: '创建日期',
                brandName: '品牌名称',
                ingredientPerson: '录入人',
                reviewer: '检查人'
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
                res = await this.$http.put(`/updateSpareParts`, this.model);
            } else {
                res = await this.$http.post('rest/categories', this.model);
            }
            this.loading = false;
            this.$router.push('/spareparts/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async fetch() {
            // const res = await this.$http.get(`rest/categories/${this.id}`);
            // this.model = res.data;
            this.loading = true;
            const res = await this.$http.get(`/getSparePartsById/${this.id}`);
            this.model = res.data.data.spareParts;
            this.model.createTime = new Date(Number(this.model.createTime));
            console.log(this.model.createTime);
            this.loading = false;
        },
    },
    created() {
        if (this.id) this.fetch();
    }
}
</script>