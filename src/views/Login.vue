<template>
    <div class="main">
        <el-card class="container">
          <div slot="header">
            <span>用户登录</span>
          </div>
          <el-form label-width="60px">
            <el-form-item label="用户名">
              <el-input v-model="model.usercode"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="model.password" type="password"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8" :offset="9">
                <el-button type="primary" style="padding: 1rem; width: 10rem" @click="login" :loading="loading">登录</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        usercode: "",
        password: ""
      },
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = false;
      const res = await this.$http.get("/api/getAllUsers");
      let users = res.data.data.users;
      console.log(users);
      let success = false;
      users.forEach(item => {
        if (item.usercode === this.model.usercode && item.password === this.model.password) {
          success = true;
        }
      });
      if (success === true) {
        sessionStorage.setItem("userLoginInfo", JSON.stringify({
          usercode: this.model.usercode,
          status: true
        }));
        this.$router.push("/");
      } else {
        this.$message({
          message: '登陆失败，用户名或密码不正确',
          type: 'error'
        });
      }
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
.main {
  width: 100%;
  height: 80vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .container {
    width: 40%;
  }
}
</style>