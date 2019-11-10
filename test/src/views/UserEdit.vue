<template>
    <div>
        user
        <h1>{{id ? "编辑" : "新建"}}物品</h1>
        id: {{id}}
        <el-form label-width="120px" @submit.native.prevent="save"
            v-loading="loading">
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
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
            loading: false
        }
    },
    methods: {
        async save() {
            this.loading = true;
            // let res;
            // if (this.id) {
            //     res = await this.$http.put(`rest/categories/${this.id}`, this.model);
            // } else {
            //     res = await this.$http.post('rest/categories', this.model);
            // }
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
            this.loading = false;

            this.$router.push('/data/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async fetch() {
            // const res = await this.$http.get(`rest/categories/${this.id}`);
            // this.model = res.data;
            this.loading = true;
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
            this.loading = false;
        },
    },
    created() {
        if (this.id) this.fetch();
    }
}
</script>