<template>
  <div id="relate-user">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="search-form" size="medium">
      <el-form-item label="登录名称" prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="searchForm.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" round icon="el-icon-search" @click="getUserList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button type="primary" icon="el-icon-plus" size="medium" @click="addRole">分配用户</el-button>
        <el-button type="danger" icon="el-icon-edit-outline" size="medium" :disabled="deleteDisabled" @click="deleteSelect">批量取消授权</el-button>
      </div>
      <el-table
        :data="tableData"
        class="tree-table"
        :header-cell-style="{background:'#EFF3F8'}"
        style="width:100%"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名称"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="部门"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="用户状态"
          width="130"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              style="display: block"
              active-color="#409eff"
              inactive-color="#dddddd"
              active-value="0"
              inactive-value="1"
              disabled
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteRelation(scope.row.id)"
            >取消权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-loading="isLoading"
        title="分配用户"
        :visible.sync="showAddDialog"
        center
        custom-class="custom-dialog"
        width="60%"
      >
        <el-form ref="searchForm2" :inline="true" :model="searchForm2" class="search-form" size="medium">
          <el-form-item label="登录名称" prop="name">
            <el-input v-model="searchForm2.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="searchForm2.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" round icon="el-icon-search" @click="getOtherUserList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm2('searchForm2')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="table-container">
          <el-table
            :data="tableData2"
            class="tree-table"
            :header-cell-style="{background:'#EFF3F8'}"
            style="width:100%;"
            fit
            highlight-current-row
            @selection-change="handleSelectionChange2"
          >
            <el-table-column
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              prop="loginName"
              label="登录名称"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="部门"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="用户状态"
              width="130"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  style="display: block"
                  active-color="#409eff"
                  inactive-color="#dddddd"
                  active-value="0"
                  inactive-value="1"
                  disabled
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="150"
            >
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :disabled="submitDisabled" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleRelatedUser, getRoleNotRelatedUser } from '@/api/user.js'
import { relateUsersByRoleId, deleteUserRole, deleteRoleUsers } from '@/api/role.js'

export default {
  data() {
    return {
      deleteDisabled: true,
      downloadLoading: false,
      submitDisabled: true,
      isLoading: false,
      searchForm: {
        name: '',
        state: ''
      },
      searchForm2: {
        name: '',
        phone: ''
      },
      showAddDialog: false,
      addRoleForm: {},
      editRoleForm: {},
      tableData: [],
      tableData2: [],
      multipleSelection: [],
      multipleSelection2: []
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({ roleId: this.$route.params.roleId }, this.searchForm)
      getRoleRelatedUser(para).then(res => {
        this.tableData = res.data
        this.$store.state.common.isLoading = 0
      })
    },
    getOtherUserList() {
      this.isLoading = true
      const para = Object.assign({ roleId: this.$route.params.roleId }, this.searchForm2)
      getRoleNotRelatedUser(para).then(res => {
        this.tableData2 = res.data
        this.isLoading = false
      })
    },
    addRole() {
      this.showAddDialog = true
      this.getOtherUserList()
    },
    deleteSelect() {
      const length = this.multipleSelection.length
      this.$confirm(`确定取消选中的${length}条用户角色吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteRoleUsers(this.multipleSelection, this.$route.params.roleId).then((req) => {
          this.$store.state.common.isLoading = 0
          this.getUserList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    deleteRelation(userId) {
      this.$confirm('确定取消该用户角色吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteUserRole(userId, this.$route.params.roleId).then((req) => {
          this.$store.state.common.isLoading = 0
          this.getUserList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getUserList()
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields()
      this.getOtherUserList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      this.editDisabled = true
      this.deleteDisabled = true
      if (val.length >= 1) {
        val.forEach(item => {
          this.multipleSelection.push(item.id)
        })
        this.deleteDisabled = false
      }
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = []
      this.submitDisabled = true
      if (val.length >= 1) {
        this.submitDisabled = false
        val.forEach(item => {
          this.multipleSelection2.push(item.id)
        })
      }
    },
    onSubmit() {
      if (this.multipleSelection2.length >= 1) {
        this.$store.state.common.isLoading = 1
        const para = { roleId: this.$route.params.roleId, userIds: this.multipleSelection2 }
        relateUsersByRoleId(para).then(res => {
          this.$store.state.common.isLoading = 0
          this.showAddDialog = false
          this.getUserList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#relate-user{
  padding:10px 15px;
  background-color:#F3F3F4;
  height:100%;
  overflow:auto;

  .search-form{
    background-color:#fff;
    padding:10px;
    border-radius:6px;
  }
  .table-container{
    margin:10px auto;
    background-color:#fff;
    padding:10px ;
    border-radius:6px;

    .btn-dom{
      padding-bottom:10px;
    }
  }
}

</style>

<style lang="scss">
.el-dialog{
  height:80%;
  .el-dialog__header{
    border-bottom:1px solid #ddd;
    background:#f8f8f8;
  }
  .el-dialog__body{
    height:calc(100% - 115px);
    overflow: auto;

  }
  .el-dialog__footer{
    border-top:1px solid #ddd;
    background:#f8f8f8;
    padding:10px;
  }
}
</style>
