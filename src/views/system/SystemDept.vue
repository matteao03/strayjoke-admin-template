<template>
  <div id="system-dept">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="searchForm.name" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="部门状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="部门状态">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getDeptList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddDeptForm">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
        <el-button type="info" icon="el-icon-sort" size="medium" @click="collapseTable">展开/折叠</el-button>
        <el-button circle type="success" icon="el-icon-menu" size="medium" style="float:right;" @click="showSearchForm = !showSearchForm"></el-button>
      </div>
      <el-table
        :data="tableData"
        class="tree-table"
        :header-cell-style="{background:'#EFF3F8'}"
        style="width:100%"
        fit
        highlight-current-row
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="部门名称"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          width="100"
        >
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="info" size="small">{{ formatStatus(scope.row.status) }}</el-tag>
            <el-tag v-else size="small">{{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="创建时间"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
              <el-tag class="el-dropdown-link" type="info">
                <i class="el-icon-setting"></i>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-tag>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="showEditBtn" :command="{type:'edit', data:scope.row}"> <i class="el-icon-edit"></i>编辑</el-dropdown-item>
                <el-dropdown-item v-if="showDeleteBtn" :command="{type:'delete', data:scope.row}"> <i class="el-icon-delete"></i>删除</el-dropdown-item>
                <el-dropdown-item v-if="showAddBtn" :command="{type:'add', data:scope.row}"> <i class="el-icon-plus"></i>添加下级菜单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="编辑部门"
      :visible.sync="showEditDeptDialog"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item v-if="pid !== 0 " label="上级部门">
          <input :value="pid" type="hidden">
          <el-input v-model="parentName" @focus="showDept">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input v-model="editForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="editForm.leader"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio v-model="editForm.status" label="0">正常</el-radio>
          <el-radio v-model="editForm.status" label="1">停用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDeptDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDept">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加部门"
      :visible.sync="showAddDeptDialog"
    >
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="上级部门">
          <input :value="pid" type="hidden">
          <el-input v-model="parentName" @focus="showDept">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input v-model="addForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="addForm.leader"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio v-model="addForm.status" label="0">正常</el-radio>
          <el-radio v-model="addForm.status" label="1">停用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDeptDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDept">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="部门选择"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <z-tree
        ref="deptTree"
        container="search-tree"
        search-container="search-dept"
        show-search
        :show-title="false"
        :tree-data="tableData"
        is-collapse
      >
      </z-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getDeptNode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDeptList, editDept, addDept, deleteDept } from '@/api/dept.js'
import { recursiveObj } from '@/utils/common.js'
import ZTree from '@/components/ZTree.vue'
import permissions from '@/permissions.js'
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
      showEditBtn: false,
      showDeleteBtn: false,
      editDisabled: true,
      showAddDeptDialog: false,
      showEditDeptDialog: false,
      dialogVisible: false,
      defaultExpandAll: false,
      addForm: {
        name: '',
        orderNum: 0,
        leader: '',
        phone: '',
        status: '0',
        email: ''
      },
      editForm: {
        name: '',
        orderNum: 0,
        leader: '',
        phone: '',
        status: '0',
        email: ''
      },
      searchForm: {
        name: '',
        status: ''
      },
      pid: 0,
      parentName: '无',
      tableData: [],
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    defaultExpandAll: function(value) {
      this.$nextTick(() => {
        const els = document.getElementsByClassName('el-table__expand-icon')
        for (let i = 0; i < els.length; i++) {
          if (value && els[i].className.indexOf('el-table__expand-icon--expanded') === -1) {
            els[i].click()
          } else if (!value && els[i].className.indexOf('el-table__expand-icon--expanded') > -1) {
            els[i].click()
          }
        }
      })
    }
  },
  mounted() {
    this.getDeptList()
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:dept:search', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:dept:add', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:dept:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:dept:edit', loginId)
    },
    formatStatus: function(value) {
      return value === '0' ? '正常' : '停用'
    },
    handleCommand(command) {
      const type = command.type
      const data = command.data
      switch (type) {
        case 'add':
          this.showAddDeptDialog = true
          this.pid = data.id
          this.parentName = data.name
          break
        case 'edit':
          this.showEditDeptForm(data)
          break
        case 'delete':
          this.$confirm('确定删除该条部门信息吗?', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.state.common.isLoading = 1
            deleteDept(data.id).then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDeptList()
            })
          })
          break
        default:
          break
      }
    },
    showAddDeptForm() {
      this.showAddDeptDialog = true
      this.pid = 0
      this.parentName = '无'
    },
    showEditDeptForm(data) {
      this.showEditDeptDialog = true
      this.editForm.id = data.id
      this.editForm.name = data.name
      this.editForm.orderNum = data.orderNum
      this.editForm.phone = data.phone
      this.editForm.leader = data.leader
      this.editForm.email = data.email
      this.editForm.status = data.status
      this.parentName = this.getNameById(data.pid)
      this.pid = data.pid
    },
    showDept() {
      this.dialogVisible = true
    },
    getDeptNode() {
      const dept = this.$refs.deptTree.getNode()
      this.pid = dept.id
      this.parentName = dept.name
      this.dialogVisible = false
    },
    getDeptList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.searchForm)
      getDeptList(para).then(res => {
        this.tableData = res.data
        this.collapseTable()
        this.$store.state.common.isLoading = 0
      })
    },
    editDept() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({ pid: this.pid }, this.editForm)
            editDept(para).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.getDeptList()
              this.showEditDeptDialog = false
            })
          })
        }
      })
    },
    addDept() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({ pid: this.pid }, this.addForm)
            addDept(para).then((res) => {
              this.$message({
                message: '部门添加成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.getDeptList()
              this.showAddDeptDialog = false
            })
          })
        }
      })
    },
    getNameById(id) {
      const data = this.tableData
      let name = '无'
      if (id === 0) {
        return name
      }
      name = recursiveObj(id, data)
      return name
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDeptList()
    },
    editSelect() {
      this.showEditDeptForm(this.multipleSelection[0])
    },
    collapseTable() {
      this.defaultExpandAll = !this.defaultExpandAll
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const length = this.multipleSelection.length
      this.editDisabled = true
      if (length === 1) {
        this.editDisabled = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#system-dept{
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
