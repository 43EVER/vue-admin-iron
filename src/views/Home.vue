<template>
  <div class="home">
    <el-container style="height: 100vh;">
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        router
        :default-active="$route.path"
      >
        <el-submenu index="/">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">常规选项</span>
          </template>
          <el-menu-item-group>
            <span slot="title">仓库</span>
            <el-menu-item index="/stock">原料库存</el-menu-item>
            <el-menu-item index="/storage">入库管理</el-menu-item>
            <el-menu-item index="/flourstorage">粉库存</el-menu-item>
            <el-menu-item index="/powder">粉入库</el-menu-item>
            <el-menu-item index="/product">产品库</el-menu-item>
            <el-menu-item index="/sales">销售库</el-menu-item>
            <el-menu-item index="/statistical">统计数据</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <span slot="title">业务</span>
            <el-menu-item index="/spareparts">备料</el-menu-item>
            <el-menu-item index="/smeltingrecord">冶炼操作记录</el-menu-item>
            <el-menu-item index="/smelting">冶炼记录</el-menu-item>
            <el-menu-item index="/flourmilling">制粉操作记录</el-menu-item>
            <el-menu-item index="/pressurerecord">压型记录</el-menu-item>
            <el-menu-item index="/pressedprocessRecord">压型工艺记录</el-menu-item>
            <el-menu-item index="/sinter">烧结记录</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <span slot="title">用户管理</span>
            <el-menu-item index="/users">用户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
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
  async created() {
    this.$store.dispatch("init");
  },
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
