<template>
  <el-menu-item
    v-if="renderOneLevel(cloneItem)"
    :index="`${basePath}/${cloneItem.path}`"
  >
    <icon-svg v-if="cloneItem.menuIcon" :icon-class="cloneItem.menuIcon" />
    <icon-svg v-else icon-class="file" />

    <span slot="title" class="menu-title">{{ cloneItem.name }}</span>
  </el-menu-item>
  <el-submenu v-else-if="cloneItem.children && !cloneItem.hidden" :index="`${num}`">
    <template slot="title">

      <icon-svg v-if="cloneItem.menuIcon" :icon-class="cloneItem.menuIcon" />
      <icon-svg v-else icon-class="menu" />

      <span slot="title" class="menu-title">{{ cloneItem.name }}</span>
    </template>

    <menu-item v-for="child in cloneItem.children" :key="child.path" :item="child" :base-path="cloneItem.path" />

  </el-submenu>
</template>

<script>

export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      cloneItem: this.item
    }
  },
  methods: {
    renderOneLevel(item) {
      let flagRender = false
      if (!item.hidden) {
        if (!item.children && item.type !== 'M') {
          flagRender = true
        } else if (item.children && item.children.length === 1 && item.children[0].path === 'dashboard') {
          this.cloneItem = item.children[0]
          flagRender = true
        } else if (item.children && item.children.length === 0) {
          flagRender = true
        }
      }
      return flagRender
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-title {
  padding-left:10px;
}
</style>

