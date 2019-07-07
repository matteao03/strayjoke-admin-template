<template>
  <img-cropper :avatar-path="avatarPath"></img-cropper>
</template>

<script>
import ImgCropper from '@/components/ImgCropper'

export default {
  components: {
    ImgCropper
  },
  data() {
    return {
      avatarPath: require('@/assets/images/profile.png')
    }
  }
}
</script>

<style>
</style>
