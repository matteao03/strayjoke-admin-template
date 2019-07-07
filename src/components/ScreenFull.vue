<template>
  <div @click="changeScreen">
    <icon-svg
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
    />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    changeScreen() {
      if (!screenfull.enabled) {
        return false
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

