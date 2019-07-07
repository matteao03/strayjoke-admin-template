<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <transition-group name="fade">
      <el-breadcrumb-item v-for="item in menuList" :key="item.path">
        {{ item.name }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name && first.name !== '工作台') {
        matched = [{ path: '/dashboard', name: '工作台', meta: { title: 'dashboard' }}].concat(matched)
      }
      this.menuList = matched
    }
  }
}
</script>

<style lang="scss">
.el-breadcrumb__item:first-child{
  .el-breadcrumb__inner:first-child{
    color:#ff2121;
  }
}
.breadcrumb {
  .el-breadcrumb__item {
    .el-breadcrumb__inner{
      color:#fff;
    }
}
}
</style>

