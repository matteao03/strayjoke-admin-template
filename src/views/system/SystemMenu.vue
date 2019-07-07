<template>
  <div id="system-menu">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="可见状态" prop="visible">
        <el-select v-model="searchForm.visible">
          <el-option label="所有" value=""></el-option>
          <el-option label="显示" :value="0"></el-option>
          <el-option label="隐藏" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getMenuList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddMenuForm">新增</el-button>
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
          label="菜单名称"
          width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
            <el-tag v-if="scope.row.type === 'C'" effect="dark" type="warning" size="small">{{ formatType(scope.row.type) }}</el-tag>
            <el-tag v-else-if="scope.row.type === 'M'" effect="dark" type="success" size="small">{{ formatType(scope.row.type) }}</el-tag>
            <el-tag v-else-if="scope.row.type ==='F'" effect="dark" size="small" type="danger">{{ formatType(scope.row.type) }}</el-tag>
            <el-tag v-else effect="dark" size="small" type="">{{ formatType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="请求地址"
          width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.path }}<el-tag v-if="scope.row.type === 'I'" size="small">{{ formatMethod(scope.row.method) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="perms"
          label="组件 / 标识"
          width="250"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="type"
          label="类型"
          width="100"
        >

        </el-table-column> -->
        <el-table-column label="可见" prop="visible" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.visible == 1" type="info" size="small">{{ formatVisible(scope.row.visible) }}</el-tag>
            <el-tag v-else size="small">{{ formatVisible(scope.row.visible) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="open"
          label="公开"
          width="130"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.open"
              style="display: block"
              active-color="#409eff"
              inactive-color="#dddddd"
              active-value="1"
              inactive-value="0"
              @change="changeMenuOpen($event, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
              <el-tag class="el-dropdown-link" type="info">
                <i class="el-icon-setting"></i>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-tag>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="showEditBtn" :command="{type:'edit', data:scope.row}"> <i class="el-icon-edit"></i>修改</el-dropdown-item>
                <el-dropdown-item v-if="showDeleteBtn" :command="{type:'delete', data:scope.row}"> <i class="el-icon-delete"></i>删除</el-dropdown-item>
                <el-dropdown-item v-if="showAddBtn" :command="{type:'add', data:scope.row}"> <i class="el-icon-plus"></i>添加下级菜单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="编辑菜单"
      :visible.sync="showEditMenuDialog"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item v-if="pid !== 0 " label="上级菜单">
          <input :value="pid" type="hidden">
          <el-input v-model="parentName" @focus="showMenu">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio v-model="editForm.type" label="M">目录</el-radio>
          <el-radio v-model="editForm.type" label="C">菜单</el-radio>
          <el-radio v-model="editForm.type" label="F">按钮</el-radio>
          <el-radio v-model="editForm.type" label="I">接口</el-radio>
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input v-model="editForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.type === 'I'" label="http 方法" prop="method">
          <el-select v-model="editForm.method" placeholder="请选择">
            <el-option
              v-for="item in httpMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="editForm.type === 'C' || editForm.type === 'I'" label="请求地址" prop="path">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item v-show="editForm.type === 'C' || editForm.type === 'F'" label="组件/标识" prop="perms">
          <el-input v-model="editForm.perms"></el-input>
        </el-form-item>
        <el-form-item v-show="editForm.type === 'M' || editForm.type === 'C'" label="图标">
          <el-input v-model="editForm.icon" @focus="showIconBoard"></el-input>
          <icons v-if="showIcon" @selected="selectIcon(editForm,arguments)"></icons>
        </el-form-item>
        <el-form-item v-show="editForm.type === 'C'" label="菜单状态" prop="visible">
          <el-radio v-model="editForm.visible" label="0">显示</el-radio>
          <el-radio v-model="editForm.visible" label="1">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加菜单"
      :visible.sync="showAddMenuDialog"
      center
    >
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="上级菜单">
          <input :value="pid" type="hidden">
          <el-input v-model="parentName" @focus="showMenu">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio v-model="addForm.type" label="M">目录</el-radio>
          <el-radio v-model="addForm.type" label="C">菜单</el-radio>
          <el-radio v-model="addForm.type" label="F">按钮</el-radio>
          <el-radio v-model="addForm.type" label="I">接口</el-radio>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input v-model="addForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 'I'" label="http 方法" prop="method">
          <el-select v-model="addForm.method" placeholder="请选择">
            <el-option
              v-for="item in httpMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="addForm.type === 'C' || addForm.type === 'I'" label="请求地址" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item v-show="addForm.type === 'C' || addForm.type === 'F'" label="组件/标识" prop="perms">
          <el-input v-model="addForm.perms"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.type === 'M' || addForm.type === 'C' " label="图标" prop="icon">
          <el-input v-model="addForm.icon" @focus="showIconBoard"></el-input>
          <icons v-if="showIcon" @selected="selectIcon(addForm,arguments)"></icons>
        </el-form-item>
        <el-form-item v-show="addForm.type === 'C'" label="菜单状态" prop="visible">
          <el-radio v-model="addForm.visible" :label="0">显示</el-radio>
          <el-radio v-model="addForm.visible" :label="1">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="菜单选择"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <z-tree
        ref="menuTree"
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
        <el-button type="primary" @click="getMenuNode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, editMenu, addMenu, deleteMenu, changeMenuOpen } from '@/api/menu.js'
import { recursiveObj } from '@/utils/common.js'
import ZTree from '@/components/ZTree.vue'
import Icons from '@/components/menu-icons'
import permissions from '@/permissions.js'
import { isRenderBtn } from '@/utils/common.js'

export default {
  components: {
    ZTree,
    Icons
  },
  data() {
    return {
      showSearchForm: true,
      showListBtn: false,
      showAddBtn: false,
      showEditBtn: false,
      showDeleteBtn: false,
      editDisabled: true,
      showEditMenuDialog: false,
      showAddMenuDialog: false,
      dialogVisible: false,
      defaultExpandAll: false,
      showIcon: false,
      editForm: {
        name: '',
        orderNum: '',
        path: '',
        perms: '',
        icon: '',
        type: 0,
        visible: 0,
        method: '1'
      },
      addForm: {
        name: '',
        orderNum: '',
        path: '',
        perms: '',
        icon: '',
        type: 'C',
        visible: 0,
        method: '1'
      },
      searchForm: {
        name: '',
        visible: ''
      },
      tableData: [],
      pid: 0,
      parentName: '无',
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
        // path: [{ required: true, message: '请输入请求地址', trigger: 'blur' }],
        // perms: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
        // method: [{ required: true, message: '请选择http方法', trigger: 'blur' }]
      },
      httpMethodOptions: [
        { value: '1', label: 'get' },
        { value: '2', label: 'post' },
        { value: '3', label: 'put' },
        { value: '4', label: 'delete' }]
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
    this.getMenuList()
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:menu:search', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:menu:add', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:menu:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:menu:edit', loginId)
    },
    formatType: function(value) {
      let type = ''
      switch (value) {
        case 'M':
          type = '目录'
          break
        case 'F':
          type = '按钮'
          break
        case 'C':
          type = '菜单'
          break
        case 'I':
          type = '接口'
          break
        default:
          break
      }
      return type
    },
    formatMethod: function(value) {
      let method = ''
      switch (value) {
        case '1':
          method = 'GET'
          break
        case '2':
          method = 'POST'
          break
        case '3':
          method = 'PUT'
          break
        case '4':
          method = 'DELETE'
          break
        default:
          break
      }
      return method
    },
    formatVisible: function(value) {
      return value === '0' ? '显示' : '隐藏'
    },
    getMenuNode() {
      const menu = this.$refs.menuTree.getNode()
      this.pid = menu.id
      this.parentName = menu.name
      this.dialogVisible = false
    },
    showMenu() {
      this.dialogVisible = true
    },
    showAddMenuForm() {
      this.showAddMenuDialog = true
      this.pid = 0
      this.parentName = '无'
    },
    showEditMenuForm(data) {
      this.showEditMenuDialog = true
      this.editForm.id = data.id
      this.editForm.name = data.name
      this.editForm.orderNum = data.orderNum
      this.editForm.type = data.type
      this.editForm.visible = data.visible
      this.editForm.path = data.path
      this.editForm.perms = data.perms
      this.editForm.method = data.method
      this.editForm.icon = data.icon
      this.parentName = this.getNameById(data.pid)
      this.pid = data.pid
      this.open = data.open
    },
    handleCommand(command) {
      const type = command.type
      const data = command.data
      switch (type) {
        case 'add':
          this.showAddMenuDialog = true
          this.pid = data.id
          this.parentName = data.name
          break
        case 'edit':
          this.showEditMenuForm(data)
          break
        case 'delete':
          this.$confirm('确定删除该条菜单信息吗?', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.state.common.isLoading = 1
            deleteMenu(data.id).then((res) => {
              this.getMenuList() // 刷新数据
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          break
        default:
          break
      }
    },
    getMenuList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.searchForm)
      getMenuList(para).then(res => {
        this.tableData = res.data
        this.defaultExpandAll = true
        this.$store.state.common.isLoading = 0
      })
    },
    editMenu() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({ pid: this.pid }, this.editForm)
            editMenu(para).then((res) => {
              this.getMenuList()
              this.$message({
                message: '菜单信息修改成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.showEditMenuDialog = false
            })
          })
        }
      })
    },
    addMenu() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const para = Object.assign({ pid: this.pid }, this.addForm)
            addMenu(para).then((res) => {
              this.getMenuList()
              this.$message({
                message: '菜单添加成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.showAddMenuDialog = false
            })
          })
        }
      })
    },
    editSelect() {
      this.showEditMenuForm(this.multipleSelection[0])
    },
    collapseTable() {
      this.defaultExpandAll = !this.defaultExpandAll
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
    selectIcon(form, val) {
      form.icon = val[0]
      this.showIcon = false
    },
    showIconBoard() {
      this.showIcon = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const length = this.multipleSelection.length
      this.editDisabled = true
      if (length === 1) {
        this.editDisabled = false
      }
    },
    changeMenuOpen(val, id) {
      let msgStr = '确定执行此操作吗?'
      if (val === '0') {
        msgStr = '确定执行此操作吗?'
      }
      this.$confirm(msgStr, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeMenuOpen({ id, open: val }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.getMenuList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#system-menu{
  padding:10px 15px;
  margin-bottom:50px;
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

