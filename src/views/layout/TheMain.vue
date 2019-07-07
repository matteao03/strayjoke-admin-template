<template>
  <el-main v-loading="$store.state.common.isLoading" class="main">
    <tags-view />
    <div class="container">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </div>
  </el-main>
</template>

<script>
import TagsView from '@/components/TagsView'
export default {
  components: {
    'tags-view': TagsView
  }
}
</script>

<style lang="scss" scoped>
.main{
  position: relative;
  transition: width .3s ease-in-out;
  padding:0;

 .container{
   height:calc(100% - 30px);
   overflow: hidden;
 }
}
</style>
