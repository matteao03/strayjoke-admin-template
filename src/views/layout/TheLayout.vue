<template>
  <el-container class="layout">
    <the-aside />
    <el-container direction="vertical">
      <the-header />
      <the-main />
    </el-container>
  </el-container>
</template>

<script>
import TheHeader from './TheHeader'
import TheAside from './TheAside'
import TheMain from './TheMain'
export default {
  components: {
    TheHeader,
    TheAside,
    TheMain
  }
}
</script>

<style lang="scss">
.layout{
  width:100%;
  height:100%;
}
</style>

