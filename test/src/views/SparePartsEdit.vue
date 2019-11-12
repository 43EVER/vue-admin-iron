<template>
    <div>
        <h1>{{brandName ? "编辑" : "新建"}}库存</h1>
        <el-form label-width="5rem" @submit.native.prevent="save"
            v-loading="loading">
            <!-- <el-form-item v-for="(value, key) in itemProps" :key="key" :label="value">
                <el-date-picker
                    v-model="model[key]"
                    type="date"
                    placeholder="选择日期"
                    v-if="key==='createTime'">
                </el-date-picker>
                <el-button type="primary"
                        v-if="key==='createTime'"
                        @click="model[key]=new Date()">当前时间</el-button>
                <el-input v-model="model[key]" v-else></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item> -->
            <el-card class="el-card-item">
                <div slot="header">
                    <span>基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="创建日期">
                            <el-date-picker v-model="model.createTime" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :push="2">
                        <el-form-item label="牌号">
                            <el-input v-model="model.brandName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="配料人">
                            <el-input v-model="model.ingredientPerson"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复合人">
                            <el-input v-model="model.reviewer"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-row>
                <el-button icon="el-icon-plus" class="mt-1"
                        @click="model.items.push({})">添加原料</el-button>
            </el-row>
            <el-card v-for="(item, idx) in model.items" :key="idx" class="card-item">
                <div slot="header" class="d-flex jc-end">
                    <el-button icon="el-icon-close" class="fc-red" @click="removeItem(idx)"></el-button>
                </div>
                <el-form-item label="成分" label-width="8rem">
                    <el-input v-model="item.component"></el-input>
                </el-form-item>
                <el-col :span="12">
                <el-form-item label="需求量" label-width="8rem">
                    <el-input v-model="item.requirement"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="配料量" label-width="8rem">
                    <el-input v-model="item.dosage"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="重要原料备注" label-width="8rem">
                        <el-input v-model="item.remarks" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-card>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        brandName: {}
    },
    data() {
        return {
            model: {
                createTime: '',
                brandName: '',
                ingredientPerson: '',
                reviewer: '',
                items: []
            },
            loading: false,
            itemProps: {
                createTime: '创建日期',
                brandName: '牌号',
                ingredientPerson: '配料人',
                reviewer: '复合人'
            },
        }
    },
    methods: {
        async save() {
            this.loading = true;
            console.log(this.model.createTime);
            this.model.createTime = this.model.createTime.getTime();
            this.model.items = this.model.items.map(item => {
                item.brandName = this.model.brandName;
                item.ingredientPerson = this.model.ingredientPerson;
                item.reviewer = this.model.reviewer;
                item.createTime = this.model.createTime;
                return item;
            });
            for (let idx in this.model.items) {
                console.log(this.model.items[idx]);
                if (this.model.items[idx].id) {
                    await this.$http.put('/updateSpareParts', this.model.items[idx]);
                } else {
                    await this.$http.post('/insertSpareParts', this.model.items[idx]);
                }
            }
            this.loading = false;
            this.$router.push('/spareparts/list');
            this.$message({
                type: 'success',
                message: '保存成功'
            });
        },

        async removeItem(idx) {
            if (this.model.items[idx].id) {
                await this.$http.delete(`/deleteSpareParts/${this.model.items[idx].id}`);
            }
            this.model.items.splice(idx, 1);
        },

        async fetch() {
            // const res = await this.$http.get(`rest/categories/${this.id}`);
            // this.model = res.data;
            this.loading = true;
            const res = await this.$http.get(`/getSparePartsByCode/${this.brandName}`);
            // this.model = res.data.data.spareParts;
            // this.model.createTime = new Date(Number(this.model.createTime));
            // console.log(this.model.createTime);
            console.log(res.data);
            this.model.items = res.data.data.getSparePartsByCode;
            this.model.createTime = new Date(Number(this.model.items[0].createTime));
            this.model.ingredientPerson = this.model.items[0].ingredientPerson;
            this.model.reviewer = this.model.items[0].reviewer;
            this.model.brandName = this.model.items[0].brandName;
            this.loading = false;
        },
    },
    created() {
        if (this.brandName) this.fetch();
        for (let prop in this.itemProps) {
            this.$set(this.model, prop, '');
        }
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
</style>