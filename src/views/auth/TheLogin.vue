<template>
  <div class="login-wrap">
    <div class="sj-login">
      <p class="sj-title">后台管理系统</p>
      <el-form ref="form" :model="form" :rules="rules" class="sj-content">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" :loading="isLoading" @click="onSubmit('form')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
import md5 from 'js-md5'
export default {
  data() {
    return {
      form: {
        name: 'admin',
        password: 'admin'
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },
  mounted() {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          //密码加密
          let para =  {admin:this.form.admin, password:md5(this.form.password)} 
          
          this.$store.dispatch('login', para).then(() => {
            this.isLoading = false
            this.$router.push('/')
          }).catch(() => {
            this.isLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
	.login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .sj-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #409EFF;
    }
    .sj-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-250px 0 0 -175px;
        border-radius: 5px;
        background:rgba(221,221,221, 0.3);
        overflow: hidden;
    }
    .sj-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
</style>
