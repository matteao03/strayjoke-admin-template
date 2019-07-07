<template>
  <el-aside :width="asideWidth" class="aside">
    <div class="logo">
      <icon-svg icon-class="logo" />
      <span class="name">后台管理系统</span>
    </div>
    <el-menu
      background-color="#324157"
      text-color="#ffffff"
      active-text-color="#ff2121"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="$route.path"
    >
      <menu-item v-for="(item, index) in sideBar" :key="item.path" :item="item" :num="index" />
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState } from 'vuex'
import MenuItem from '@/components/MenuItem'
import permissions from '@/permissions'
import '@/components/menu-icons/requireIcons.js'

export default {
  components: {
    'menu-item': MenuItem
  },
  computed: {
    ...mapState({
      asideWidth: state => (state.common.isCollapseNav === 1 ? '60px' : '200px'),
      isCollapse: state => state.common.isCollapseNav === 1
    }),
    sideBar: () => {
      let sideBar = []
      permissions.state.routes.forEach(item => {
        if (item.path === '/') {
          sideBar = item.children
        }
      })
      return sideBar
    }
  }
}
</script>

<style lang="scss">
.aside {
  background-color: #324157;
  color: #fff;
  overflow: hidden;
  z-index: 1001;
  transition:width .3s ease-in-out;
}
.logo {
  height: 60px;
  background-color: #242f42;
  line-height: 60px;
  padding: 0 20px;
  font-size: 18px;
  overflow: hidden;
  .name {
    padding-left: 15px;
  }
}
.el-menu {
  border: none;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 60px);
}
</style>
