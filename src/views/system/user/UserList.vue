<template>
  <div id="user-list">
    <z-tree v-if="showTree" class="tree" :tree-data="treeData" is-collapse @changeEmpl="changeEmpl"></z-tree>
    <div class="resizer">
      <div class="arrow-container" @click="collapseLeft">
        <i ref="arrow" class="el-icon-caret-left arrow" />
      </div>
    </div>
    <div class="right">
      <el-form v-if="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="medium">
        <el-form-item label="登录名称" prop="name">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="searchForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="searchForm.status">
            <el-option label="所有" value=""></el-option>
            <el-option v-for="item in dictData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="start_at">
          <el-date-picker
            v-model="searchForm.start_at"
            type="date"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span> - </span>
        </el-form-item>

        <el-form-item prop="end_at">
          <el-date-picker
            v-model="searchForm.end_at"
            type="date"
            placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getUserList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="addUser">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
        <el-button v-if="showDeleteBtn" type="info" icon="el-icon-delete" size="medium" :disabled="deleteDisabled" @click="deleteSelect">删除</el-button>
        <el-button type="danger" icon="el-icon-download" size="medium" :loading="downloadLoading" @click="handleDownload">导出</el-button>
        <el-button circle type="success" icon="el-icon-menu" size="medium" style="float:right;" @click="showSearchForm = !showSearchForm"></el-button>
      </div>
      <div class="table-container">
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
                @change="changeUserOpen($event, scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="150"
            sortable
          >
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="showEditBtn"
                size="mini"
                type="success"
                @click="editUser(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="showDeleteBtn"
                size="mini"
                type="danger"
                @click="deleteUser(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="showResetPassword(scope.row)"
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block-pagination">
          <el-pagination
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <z-tree container="search-tree" search-container="search-dept" show-search :show-title="false"></z-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="dialogFormVisible" center custom-class="reset-dialog">
      <el-form :model="resetPasswordForm">
        <el-form-item label="登录名称" label-width="80px">
          <el-input v-model="resetPasswordForm.loginName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="resetPasswordForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入excel" :visible.sync="uploadVisible" center class="upload-dialog">
      <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
  </div>
</template>

<script>
import ZTree from '@/components/ZTree.vue'
import UploadExcel from '@/components/UploadExcel.vue'
import { getDeptList } from '@/api/dept.js'
import { selectDictDataByType } from '@/api/dict.js'
import { getUserList, deleteUser, resetPassword, changeUserOpen, deleteUsers } from '@/api/user.js'
import { isRenderBtn } from '@/utils/common.js'
import permissions from '@/permissions.js'

export default {
  components: {
    ZTree,
    UploadExcel
  },
  data() {
    return {
      showSearchForm: true,
      showListBtn: false,
      showAddBtn: false,
      showBatchDeleteBtn: false,
      showDeleteBtn: false,
      showEditBtn: false,
      editDisabled: true,
      deleteDisabled: true,
      uploadVisible: false,
      showTree: true,
      downloadLoading: false,
      uploadloadLoading: false,
      searchForm: {
        name: '',
        status: '',
        phone: '',
        start_at: '',
        end_at: ''
      },
      resetPasswordForm: {
        loginName: '',
        password: ''
      },
      dialogVisible: false,
      dialogFormVisible: false,
      treeData: [],
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      total: 0,
      dictData: []
    }
  },
  created() {
    this.getUserList()
    this.getDeptList()
    this.selectDictDataByType('sys_show_hide')
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:user:search', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:user:add', loginId)
      this.showBatchDeleteBtn = isRenderBtn(btnPerms, 'system:user:batchDelete', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:user:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:user:edit', loginId)
    },
    getUserList(val) {
      this.$store.state.common.isLoading = 1
      let para = Object.assign({ page: this.currentPage, size: this.pageSize }, this.searchForm)
      if (val) {
        para = Object.assign(val, para)
      }
      getUserList(para).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.$store.state.common.isLoading = 0
      })
    },
    selectDictDataByType(type) {
      selectDictDataByType(type).then(res => {
        this.dictData = res.data
      })
    },
    changeEmpl(id) {
      this.getUserList({ 'dept_id': id })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    getDeptList() {
      getDeptList().then(res => {
        this.treeData = res.data
      })
    },
    handleDetail() {
      this.dialogVisible = true
    },
    collapseLeft() {
      this.showTree = !this.showTree
      if (this.showTree) {
        this.$refs.arrow.style.transform = 'rotate(360deg)'
      } else {
        this.$refs.arrow.style.transform = 'rotate(180deg)'
      }
    },
    addUser() {
      this.$router.push('addUser')
    },
    editUser(data) {
      this.$router.push('editUser/' + data.id)
    },
    deleteUser(data) {
      this.$confirm('确定删除该条用户信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteUser(data.id).then((res) => {
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    changeUserOpen(val, id) {
      let msgStr = '确定要停用用户吗?'
      if (val === '0') {
        msgStr = '确定要启用用户吗?'
      }
      this.$confirm(msgStr, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        changeUserOpen({ id, open: val }).then((res) => {
          this.$store.state.common.isLoading = 0
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.getUserList()
        })
      })
    },
    showResetPassword(data) {
      this.resetPasswordForm.loginName = data.loginName
      this.resetPasswordForm.password = ''
      this.resetPasswordForm.id = data.id
      this.dialogFormVisible = true
    },
    resetPassword() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.resetPasswordForm)
      resetPassword(para).then(res => {
        this.$store.state.common.isLoading = 0
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.dialogFormVisible = false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const length = this.multipleSelection.length
      this.editDisabled = true
      this.deleteDisabled = true
      if (length === 1) {
        this.editDisabled = false
      }
      if (length >= 1) {
        this.deleteDisabled = false
      }
    },
    editSelect() {
      this.editUser(this.multipleSelection[0])
    },
    deleteSelect() {
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条用户信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        this.$store.state.common.isLoading = 1
        deleteUsers(ids).then(res => {
          this.$store.state.common.isLoading = 0
          this.getUserList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    handleDownload() {
      this.$confirm('确定导出所有用户信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.downloadLoading = true
        import('@/utils/Export2Excel').then(excel => {
          const tHeader = ['登录名称', '姓名', '部门', '手机', '创建时间']
          const filterVal = ['loginName', 'userName', 'deptName', 'phone', 'createTime']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${new Date().getHours()}:${new Date().getMinutes()}-user-list`
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleUpload() {
      this.uploadVisible = true
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess(data) {
      const res = []
      data.results.forEach((val, index) => {
        const obj = {}
        for (const i in val) {
          switch (i) {
            case '创建时间':
              obj.createTime = val[i]
              break
            case '姓名':
              obj.userName = val[i]
              break
            case '登录名称':
              obj.loginName = val[i]
              break
            case '手机':
              obj.phone = val[i]
              break
            case '部门':
              obj.deptName = val[i]
              break
          }
        }
        res.push(obj)
      })
      this.tableData = this.tableData.concat(res)
    }
  }
}
</script>

<style lang="scss" scoped>
#user-list {
  display: flex;
  flex-direction: row;
  background-color:#F3F3F4;
  height:100%;
  padding:10px 0 10px 10px;

  .tree{
    overflow: hidden;
    width: 200px;
  }
}

.demo-form-inline{
  background-color:#fff;
  padding:10px;
  border-radius:6px;
   box-shadow: 1px 1px 3px rgba(0,0,0,.2);
}
.right{
  margin:0 5px 0 10px;
  overflow:auto;
  flex:1;
  padding-right:5px;

  .btn-dom{
    margin-top:10px;
    padding:10px;
    background:#fff;
    border-top-left-radius:6px;
    border-top-right-radius:6px;
  }
  .table-container{
    width:100%;
    padding:0 10px;
    background-color:#fff;

    .tree-table{
      background:#fff;
      overflow: hidden;
      margin:0;
      border-bottom-left-radius:6px;
      border-bottom-right-radius:6px;
      box-shadow: 1px 1px 3px rgba(0,0,0,.2);
    }
  }
}
.resizer{
  width:8px;
  background-color: #fafafa;
  display:flex;
  align-items:center;

  .arrow-container{
    width:8px;
    height:50px;
    line-height:50px;
    cursor: pointer;
    background-color: #eee;
    .arrow{
      margin-left:-4px;
    }
    &:hover{
      background-color:#fc6;
    }
  }
}
.block-pagination{
  padding:20px 0 15px;
}
</style>

<style lang="scss">
.reset-dialog{
  height:450px;
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

