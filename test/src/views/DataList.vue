<template>
    <div>
        <el-table :data="getItems"
            style="width: 100%">
            <el-table-column label="Date" prop="date">
            </el-table-column>
            <el-table-column label="Name" prop="name">
            </el-table-column>
            <el-table-column align="right">
                <template slot="header">
                    <el-input v-model="search" size="mini"/>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
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
            items: new Array(5).fill({
                name: 'liuyang',
                date: '1999-01-04',
                address: 'fuck'
            }),
            search: '123'
        };
    },
    methods: {
        handleEdit(index, row) {

        },
        handleDelete(index, row) {
            this.$confirm(`是否确定删除 "${row.name}"`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
            //   const res = await this.$http.delete(`rest/items/${row._id}`);
            //   console.log(res);
                this.items.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                // this.fetch();
            }, async() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });
            });
        }
    },
    computed: {
        getItems() {
            console.log(this.items);
            return this.items;
        }
    }
}
</script>