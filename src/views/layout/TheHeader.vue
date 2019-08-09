<template>
  <el-header class="header">
    <div class="aside-collapse" @click="toggleClick">
      <icon-svg icon-class="collapse" :class="{active:isCollapse}" />
    </div>
    <bread-crumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-badge is-dot class="item" style="line-height:30px;margin-right:10px;">
        <i class="el-icon-message"></i>
      </el-badge>

      <!-- <search-menu class="right-menu-item" /> -->
      <screen-full class="right-menu-item" />

      <el-dropdown class="right-menu-item" trigger="click" @command="handleCommand">
        <div class="el-dropdown-link admin-avatar">
          <img :src="avatar">
          <span class="admin-name">
            {{ this.$store.state.auth.nickName }}
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
          <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="重置密码"
      :visible.sync="showPasswordForm"
      center
    >
      <el-form ref="passwordForm" :model="passwordForm" label-width="80px">
        <el-form-item label="登录名称">
          <el-input v-model="passwordForm.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码">
          <el-input v-model="passwordForm.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="再次确认">
          <el-input v-model="passwordForm.confirmed"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPasswordForm = !showPasswordForm">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
import BreadCrumb from '@/components/BreadCrumb'
import ScreenFull from '@/components/ScreenFull'
import SearchMenu from '@/components/SearchMenu'
import { editPassword } from '@/api/auth.js'

export default {
  components: {
    'bread-crumb': BreadCrumb,
    'screen-full': ScreenFull,
    'search-menu': SearchMenu
  },
  data() {
    return {
      isCollapse: this.$store.state.common.isCollapseNav,
      showPasswordForm: false,
      passwordForm: {
        loginName:this.$store.state.auth.loginName,
        password:this.$store.state.auth.password,
        newPassword:'',
        confirmed:'',
      },
    }
  },
  computed: {
    avatar: function() {
      let result = ''
      if (this.$store.state.auth.avatar) {
        result = `/api/${this.$store.state.auth.avatar}`
      } else {
        result = require('@/assets/images/admin-avatar.gif')
      }
      return result
    }
  },
  methods: {
    toggleClick() {
      if (this.isCollapse === 1) {
        this.isCollapse = 0
      } else {
        this.isCollapse = 1
      }
      this.$store.commit('SET_COLLAPSE_NAV', this.isCollapse)
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$store.dispatch('logout').then(() => {
            this.$router.push({ path: '/login?from=logout' })
          })
          break
        case 'userInfo':
          this.$router.push('/system/user/profile')
          break
        case 'modifyPassword':
          this.showPasswordForm = true
          break
        default:
          break
      }
    },
    resetPassword() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.passwordForm)
            editPassword(para).then(() => {
              this.$store.state.common.isLoading = 0
              this.showPasswordForm = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color:#242F42;
  padding:0;
  line-height:60px;
  user-select: none;
}
.aside-collapse{
  font-size:24px;
  cursor: pointer;
  padding:0 20px;
  display: inline-block;
  float:left;

  &:hover{
    background-color: #242F22;
  }

  .active {
    transform: rotate(180deg);
  }
}

.breadcrumb-container{
    display:inline-block;
    line-height: 60px;
}

.right-menu{
  float:right;
  line-height: 60px;
  height:100%;
  color:#fff;
  margin-right:20px;
  font-size: 20px;

  &:focus{
    outline:none;
  }

  .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      height: 100%;
      vertical-align: middle;
      cursor: pointer;

      .admin-avatar{
        overflow:hidden;
        height:100%;
        outline:none;

        img{
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin:10px 5px;
        }
        .admin-name{
          position:relative;
          top:-25px;
          color:#fff;
        }
      }
    }
}
</style>

<style lang="scss">

</style>

