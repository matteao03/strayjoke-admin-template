<template>
  <div class="icons-wrapper">
    <div v-for="(item,index) in iconItems" :key="index">
      <div class="icon-item" @click="selectName(item)">
        <icon-svg :icon-class="item" />
      </div>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'

export default {
  name: 'Icons',
  data() {
    return {
      iconItems: icons
    }
  },
  created() {
  },
  methods: {
    selectName(name) {
      this.$emit('selected', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-wrapper {
  margin: 10px 0;
  height:100px;
  overflow: auto;
  background-color:#ddd;

  .icon-item {
    margin: 5px;
    height: 35px;
    text-align: center;
    width: 35px;
    float: left;
    font-size: 32px;
    cursor: pointer;
  }
}
</style>

