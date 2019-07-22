<template>
  <div id="system-role">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form" size="medium">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="searchForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="state">
        <el-select v-model="searchForm.status" placeholder="角色状态">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="item in dictData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getRoleList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showListBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddRoleForm">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
        <el-button v-if="showDeleteBtn" type="info" icon="el-icon-delete" size="medium" :disabled="deleteDisabled" @click="deleteSelect">删除</el-button>
        <el-button v-if="showExportBtn" type="danger" icon="el-icon-download" size="medium" :loading="downloadLoading" @click="handleDownload">导出</el-button>
        <el-button circle type="success" icon="el-icon-menu" size="medium" style="float:right;" @click="showSearchForm = !showSearchForm"></el-button>
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
          prop="id"
          label="角色编号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="roleKey"
          label="权限字符"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="roleSort"
          label="显示顺序"
          width="150"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="角色状态"
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
              @click="showEditRoleForm(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="showPermissionForm(scope.row)"
            >数据权限</el-button>
            <el-button
              v-if="showDispatchUserBtn"
              size="mini"
              type="success"
              @click="relateUser(scope.row.id)"
            >分配用户</el-button>
            <el-button
              v-if="showDeleteBtn"
              size="mini"
              type="danger"
              @click="deleteRole(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="添加角色"
        :visible.sync="showAddDialog"
        center
      >
        <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="name" :error="errorsMsg.nameMsg">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="权限字符" prop="roleKey" :error="errorsMsg.keyMsg">
            <el-input v-model="addForm.roleKey"></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input v-model="addForm.roleSort"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-for="item in dictData" :key="item.value" v-model="addForm.status" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" :error="errorsMsg.menuIdsMsg">
            <z-tree container="role-tree" search-container="role-dept" :show-title="false" :tree-data="treeData" is-check @checkNode="checkNodeIds"></z-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑角色"
        :visible.sync="showEditDialog"
        center
      >
        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="name" :error="errorsMsg.nameMsg">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="权限字符" prop="roleKey" :error="errorsMsg.keyMsg">
            <el-input v-model="editForm.roleKey"></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="roleSort">
            <el-input v-model="editForm.roleSort"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-for="item in dictData" :key="item.value" v-model="editForm.status" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="editForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" :error="errorsMsg.menuIdsMsg">
            <z-tree container="role-tree-2" search-container="role-dept-2" :show-title="false" :tree-data="checkedTreeData" is-check @checkNode="checkNodeIds"></z-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="分配数据权限"
        :visible.sync="showPermissionDialog"
        center
      >
        <el-form ref="permissionForm" :model="permissionForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="permissionForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限字符">
            <el-input v-model="permissionForm.roleKey" disabled></el-input>
          </el-form-item>
          <el-form-item label="数据范围">
            <el-select v-model="permissionForm.dataScope" placeholder="请选择" @change="changeDataScope">
              <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showDeptDataScope" v-loading="isDataLoading" label="数据权限" :error="errorsMsg.menuIdsMsg">
            <z-tree container="dept-tree" search-container="dept-scope" :show-title="false" :tree-data="checkedDeptData" is-check @checkNode="checkDeptIds"></z-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button>取 消</el-button>
          <el-button type="primary" @click="relateDataPermission">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ZTree from '@/components/ZTree.vue'
import { getRoleList, editRole, addRole, deleteRole, deleteRoles, relateDataPermission } from '@/api/role.js'
import { selectDictDataByType } from '@/api/dict.js'
import { getCheckedMenuList, getMenuList } from '@/api/menu.js'
import { getCheckedDeptList } from '@/api/dept.js'
import { isRenderBtn } from '@/utils/common.js'

export default {
  components: {
    ZTree
  },
  data() {
    return {
      showSearchForm: true,
      showListBtn: false,
      showAddBtn: false,
      showBatchDeleteBtn: false,
      showDeleteBtn: false,
      showEditBtn: false,
      showExportBtn: false,
      showDispatchUserBtn: false,
      editDisabled: true,
      deleteDisabled: true,
      downloadLoading: false,
      menuIds: [],
      searchForm: {
        name: '',
        status: ''
      },
      showEditDialog: false,
      showAddDialog: false,
      showPermissionDialog: false,
      showDeptDataScope: false,
      checkedDeptData: [],
      isDataLoading: false,
      deptIds: [],
      permissionForm: {},
      addForm: {
        name: '',
        roleKey: '',
        roleSort: 0,
        status: '0',
        remark: ''
      },
      editForm: {
        name: '',
        roleKey: '',
        roleSort: 0,
        status: '0',
        remark: ''
      },
      tableData: [],
      treeData: [],
      checkedTreeData: [],
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请输入权限字符', trigger: 'blur' }]
      },
      errorsMsg: {
        nameMsg: '',
        keyMsg: '',
        menuIdsMsg: ''
      },
      dataScopeOptions: [
        { value: '1', label: '全部数据权限' },
        { value: '2', label: '自定义数据权限' }
      ],
      dictData: []
    }
  },
  mounted() {
    this.getRoleList()
    this.selectDictDataByType('sys_show_hide')
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = this.$store.state.btnPermissions
      const loginId = this.$store.state.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:role:search', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:role:add', loginId)
      this.showBatchDeleteBtn = isRenderBtn(btnPerms, 'system:role:batchDelete', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:role:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:role:edit', loginId)
      this.showExportBtn = isRenderBtn(btnPerms, 'system:role:export', loginId)
      this.showDispatchUserBtn = isRenderBtn(btnPerms, 'system:role:dispatchUser', loginId)
    },
    getCheckedMenuList(roleId) {
      const para = Object.assign({ roleId })
      getCheckedMenuList(para).then(res => {
        this.checkedTreeData = res.data.tree
        this.menuIds = res.data.menuIds
      })
    },
    getMenuList() {
      const para = Object.assign({})
      getMenuList(para).then(res => {
        this.treeData = res.data
      })
    },
    selectDictDataByType(type) {
      selectDictDataByType(type).then(res => {
        this.dictData = res.data
      })
    },
    checkNodeIds(nodeIds) {
      this.menuIds = nodeIds
    },
    checkDeptIds(nodeIds) {
      this.deptIds = nodeIds
    },
    addRole() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const para = Object.assign({ menuIds: this.menuIds }, this.addForm)
            addRole(para).then((res) => {
              this.getRoleList() // 刷新数据
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.showAddDialog = false
            }).catch(err => {
              const errors = err.errors ? err.errors : {}
              this.errorsMsg.nameMsg = errors.name ? errors.name : ''
              this.errorsMsg.keyMsg = errors.roleKey ? errors.roleKey : ''
              this.errorsMsg.menuIdsMsg = errors.menuIds ? errors.menuIds : ''
            })
          })
        }
      })
    },
    editRole() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({ pid: this.pid, menuIds: this.menuIds }, this.editForm)
            editRole(para).then((res) => {
              this.getRoleList()
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.showEditDialog = false
            }).catch(err => {
              const errors = err.errors ? err.errors : {}
              this.errorsMsg.nameMsg = errors.name ? errors.name : ''
              this.errorsMsg.keyMsg = errors.roleKey ? errors.roleKey : ''
              this.errorsMsg.menuIdsMsg = errors.menuIds ? errors.menuIds : ''
            })
          })
        }
      })
    },
    showEditRoleForm(data) {
      this.showEditDialog = true
      this.editForm = data
      this.errorsMsg = { nameMsg: '', keyMsg: '', menuIdsMsg: '' }
      this.getCheckedMenuList(data.id)
    },
    showAddRoleForm() {
      this.showAddDialog = true
      this.menuIds = []
      this.errorsMsg = { nameMsg: '', keyMsg: '', menuIdsMsg: '' }
      this.getMenuList()
    },
    editSelect() {
      this.showEditRoleForm(this.multipleSelection[0])
    },
    deleteSelect() {
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条角色信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        this.$store.state.common.isLoading = 1
        deleteRoles(ids).then(res => {
          this.$store.state.common.isLoading = 0
          this.getRoleList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    showPermissionForm(data) {
      this.showPermissionDialog = true
      this.permissionForm = data
      this.isDataLoading = 1
      getCheckedDeptList({ roleId: data.id }).then(res => {
        this.checkedDeptData = res.data.tree
        this.deptIds = res.data.deptIds
        this.isDataLoading = 0
      }).catch(() => {
        this.isDataLoading = 0
      })

      if (data.dataSope === '2') {
        this.showDeptDataScope = true
      } else {
        this.showDeptDataScope = false
      }
    },
    relateDataPermission() {
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = { id: this.permissionForm.id, dataScope: this.permissionForm.dataSope, deptIds: this.deptIds }
            console.log(para)
            relateDataPermission(para).then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.showPermissionDialog = false
              this.$store.state.common.isLoading = 0
            })
          })
        }
      })
    },
    relateUser(id) {
      this.$router.push(`relatedUser/${id}`)
    },
    deleteRole(data) {
      this.$confirm('确定删除该条角色信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteRole(data.id).then((res) => {
          this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getRoleList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.searchForm)
      getRoleList(para).then(res => {
        this.tableData = res.data
        this.$store.state.common.isLoading = 0
      })
    },
    changeDataScope(val) {
      this.permissionForm.dataSope = val
      if (val === '2') {
        this.showDeptDataScope = true
      } else {
        this.showDeptDataScope = false
      }
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
    handleDownload() {
      this.$confirm('确定导出所有角色信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.downloadLoading = true
        import('@/utils/Export2Excel').then(excel => {
          const tHeader = ['角色编号', '角色名称', '权限字符', '显示顺序', '角色状态', '创建时间']
          const filterVal = ['id', 'roleName', 'roleKey', 'roleSort', 'status', 'createTime']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `${new Date().getHours()}-${new Date().getMinutes()}-role-list`
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
#system-role{
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
