<template>
  <div class="main">
    <el-container style="height: 100vh;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router class="el-menu-vertical-demo"
          :default-active="$route.path"
          unique-opened
          :default-openeds="defaultOpends"
          @open="handleOpen" @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span> 
            </template>
            <el-menu-item-group>
              <template slot="title">测试用</template>
              <el-menu-item index="/data/list">DataList</el-menu-item>
              <el-menu-item index="/data/edit">DataEdit</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="用户管理">
              <el-menu-item index="/privilege/edit">添加权限</el-menu-item>
              <el-menu-item index="/privilege/list">权限列表</el-menu-item>
              <el-menu-item index="/user/edit">添加用户</el-menu-item>
              <el-menu-item index="/user/list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>测试用户</span>
        </el-header>

        <el-main>
          <router-view :key="$route.path"></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<style>
  body {
    margin: 0;
    padding: 0;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
  export default {
    data() {
      return {
        defaultOpends: []
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log('open',key, keyPath);
        this.defaultOpends.push(key);
      },
      handleClose(key, keyPath) {
        console.log('close', key, keyPath);
        this.defaultOpends = this.defaultOpends.filter(k => (k === key));
      }
    }
  };
</script>