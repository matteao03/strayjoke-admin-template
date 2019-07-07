<template>
  <div class="img-cropper">
    <div class="left">
      <vue-cropper
        ref="cropper"
        :src="imgSrc"
        :view-mode="1"
        :modal="false"
        drag-mode="move"
        :movable="false"
        auto-crop
        :img-style="{ 'width': '400px', 'height': '300px' }"
      ></vue-cropper>

      <div class="operate">
        <input
          type="file"
          name="image"
          accept="image/*"
          style="width:100px; height:40px;position:absolute;opacity:0;cursor: pointer;"
          @change="setImage"
        >
        <el-button type="primary">上传头像</el-button>
        <el-button v-if="imgSrc != ''" type="primary" round @click="cropImage">裁剪</el-button>
        <el-button v-if="imgSrc != ''" type="primary" round @click="rotate">翻转</el-button>
      </div>
    </div>
    <div class="right">
      <img :src="cropImg" style="width: 200px; height: 150px; border: 1px solid gray" alt="Cropped Image">
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'

export default {
  components: {
    VueCropper
  },
  props: {
    avatarPath: {
      default: ''
    }
  },
  data() {
    return {
      imgSrc: '',
      cropImg: ''
    }
  },
  created() {
    this.imgSrc = this.cropImg = this.avatarPath
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image/')) {
        alert('')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgSrc = event.target.result
          this.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.$emit('cropImg', this.cropImg)
    },
    rotate() {
      this.$refs.cropper.rotate(90)
    }
  }
}
</script>

<style  lang="scss" scoped>
.img-cropper{
  display:flex;
  padding:10px 15px;

  .left{
    .operate{
      margin-top:10px;
    }
  }
  .right{

  }
}
</style>
