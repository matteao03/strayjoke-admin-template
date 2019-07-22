<template>
  <el-row id="profile" :gutter="20">
    <el-col id="info" :span="8">
      <div class="title">个人资料</div>
      <div class="content">
        <div class="avatar">
          <img width="120" height="120" :src="avatar">
          <p class="change-avatar" @click="changeAvatarDialog">修改头像</p>
        </div>
        <ul class="list">
          <li class="list-item">登录名称:<span class="item-info">{{ baseForm.name }}</span></li>
          <li class="list-item">手机号码:<span class="item-info">{{ baseForm.phone }}</span></li>
          <li class="list-item">部门:<span class="item-info">{{ baseForm.dept }}</span></li>
          <li class="list-item">岗位:<span class="item-info">{{ posts }}</span></li>
          <li class="list-item">邮箱:<span class="item-info">{{ baseForm.email }}</span></li>
          <li class="list-item">创建时间:<span class="item-info">{{ baseForm.createTime }}</span></li>
        </ul>
      </div>
    </el-col>
    <el-col id="base" :span="16">
      <div class="title">基本资料</div>
      <div class="content">
        <el-tabs type="card">
          <el-tab-pane label="基本资料">
            <el-form ref="baseForm" :model="baseForm" label-width="80px">
              <el-form-item label="用户名称">
                <el-input v-model="this.$store.state.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="this.$store.state.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="this.$store.state.email"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-radio v-model="this.$store.state.sex" label="0">男</el-radio>
                <el-radio v-model="this.$store.state.sex" label="1">女</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码">
            <el-form ref="safeForm" :model="safeForm" label-width="80px">
              <el-form-item label="旧密码">
                <el-input v-model="safeForm.password"></el-input>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="safeForm.newPassword"></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input v-model="safeForm.confirmed"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="savePassword">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>

    <el-dialog
      title="修改头像"
      :visible.sync="showAvatarDialog"
      center
    >
      <img-cropper :avatar-path="avatar" @cropImg="saveAvatar"></img-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAvatarDialog = !showAvatarDialog">取 消</el-button>
      </span>
    </el-dialog>

  </el-row>
</template>

<script>
import ImgCropper from '@/components/ImgCropper'
import { editProfile, editPassword, editAvatar } from '@/api/auth.js'

export default {
  components: {
    ImgCropper
  },
  data() {
    return {
      baseForm:{},
      safeForm: {
        password: '',
        newPassword: ''
      },
      showAvatarDialog: false
    }
  },
  computed: {
    avatar: () => {
      let result = ''
      if (this.$store.state.avatar) {
        result = `/api/${this.$store.state.avatar}`
      } else {
        result = require('@/assets/images/profile.png')
      }
      return result
    },
    posts: () => {
      return this.$store.state.posts.join('/')
    }
  },
  methods: {
    changeAvatarDialog() {
      this.showAvatarDialog = true
    },
    saveInfo() {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            console.log(this.baseForm)
            const para = Object.assign({}, this.baseForm)
            editProfile(para).then((res) => {
              this.$store.state.common.isLoading = 0
              this.$message({
                message: '提交成功',
                type: 'success'
              })
            })
          })
        }
      })
    },
    savePassword() {
      this.$refs.safeForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.safeForm)
            editPassword(para).then((res) => {
              this.$store.state.common.isLoading = 0
              this.$message({
                message: '提交成功',
                type: 'success'
              })
            })
          })
        }
      })
    },
    saveAvatar(baseUrl) {
      if (baseUrl) {
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.$store.state.common.isLoading = 1
          const para = { avatar: baseUrl }
          editAvatar(para).then((res) => {
            this.$store.state.common.isLoading = 0
            this.showAvatarDialog = false
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#profile{
    height:100%;
    width:100%;
    background:#f3f4f5;
    padding: 10px;
    box-sizing:border-box;
    margin:0 !important;

    #info{
        background:#fff;
        border-right:10px solid #f3f4f5;
        border-radius:10px;
        border-bottom-right-radius:0;
        box-shadow: -2px 2px 2px #ddd;
        padding:0 !important;

        .title{
            padding:10px;
            font-size:18px;
            font-weight: bold;
        }
        .content{
            padding:10px;

            .avatar{
                text-align:center;
            }
            .change-avatar{
                color:#409eff;
                cursor: pointer;
                padding:5px 0;
                &:hover{
                    color:#1989fa;
                }
            }
            .list{
                .list-item{
                    color:#888;
                    padding:10px 0;
                    border-bottom:1px solid #eee;

                    .item-info{
                        float:right;
                        color:#000;
                    }
                }
            }

        }

    }
    #base{
        background:#fff;
        border-left:none;
        border-radius:10px;
        box-shadow: 2px 2px 2px #ddd;
        padding:0 !important;

       .title{
            padding:10px;
            font-size:18px;
            font-weight: bold;
        }
        .content{
            padding:10px;
        }
    }
}

</style>
