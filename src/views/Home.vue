<template>
  <div class="home">
    <el-container style="height: 100vh;">
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        router
        :default-active="$route.path"
      >
        <el-submenu>
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">常规选项</span>
          </template>
          <el-menu-item-group>
            <span slot="title">仓库</span>
            <el-menu-item index="/stock">原料库存</el-menu-item>
            <el-menu-item index="/ruku">入库管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
      <el-container>
        <el-header>
          <div @click="toggleCollapse" class="collapseIconContainer">
            <i :class="collapseIcon"></i>
          </div>
        </el-header>

        <el-main>
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// // @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  data() {
    return {
      show: true,
      list: [1, 2, 3],
      isCollapse: true,
      collapseIcon: "el-icon-s-fold",
      activeIndex: ""
    };
  },
  name: "home",
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse === true) this.collapseIcon = "el-icon-s-fold";
      else this.collapseIcon = "el-icon-s-unfold";
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.collapseIconContainer {
  font-size: 1.5rem;
  transition: all 0.5s ease;
  cursor: pointer;
  display: inline-block;
}

.collapseIconContainer:hover {
  color: #409eff;
}
</style>
