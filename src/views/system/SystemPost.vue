<template>
  <div id="system-post">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="searchForm.code"></el-input>
      </el-form-item>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="岗位状态">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getPostList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddDialog = !showAddDialog">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
        <!-- <el-button v-if="showDeleteBtn" type="info" icon="el-icon-delete" size="medium" :disabled="deleteDisabled" @click="deleteSelect">删除</el-button> -->
        <el-button type="danger" icon="el-icon-download" size="medium" :loading="downloadLoading" @click="handleDownload">导出</el-button>
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
          prop="id"
          label="岗位编号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="岗位编码"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="岗位名称"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="sort"
          label="显示顺序"
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
            <el-button
              v-if="showEditBtn"
              size="mini"
              type="success"
              @click="showEditForm(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="showDeleteBtn"
              size="mini"
              type="danger"
              @click="deletePost(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="编辑岗位"
      :visible.sync="showEditDialog"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio v-model="editForm.status" label="0">正常</el-radio>
          <el-radio v-model="editForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPost">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加岗位"
      :visible.sync="showAddDialog"
    >
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio v-model="addForm.status" label="0">正常</el-radio>
          <el-radio v-model="addForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPost">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPostList, editPost, addPost, deletePost, deletePosts } from '@/api/post.js'
import permissions from '@/permissions.js'
import { isRenderBtn } from '@/utils/common.js'

export default {
  data() {
    return {
      showSearchForm: true,
      showListBtn: false,
      showAddBtn: false,
      showEditBtn: false,
      showDeleteBtn: false,
      editDisabled: true,
      deleteDisabled: true,
      showAddDialog: false,
      showEditDialog: false,
      addForm: {
        code: '',
        name: '',
        sort: 0,
        status: '0',
        remark: ''
      },
      editForm: {
        code: '',
        name: '',
        sort: 0,
        status: '0',
        remark: ''
      },
      searchForm: {
        code: '',
        name: '',
        status: ''
      },
      tableData: [],
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getPostList()
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
    showEditForm(data) {
      this.showEditDialog = true
      this.editForm.id = data.id
      this.editForm.name = data.name
      this.editForm.code = data.code
      this.editForm.sort = data.sort
      this.editForm.status = data.status
      this.editForm.remark = data.remark
    },
    getPostList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.searchForm)
      getPostList(para).then(res => {
        this.tableData = res.data
        this.$store.state.common.isLoading = 0
      })
    },
    editPost() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.editForm)
            editPost(para).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.getPostList()
              this.showEditDialog = false
            })
          })
        }
      })
    },
    addPost() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.addForm)
            addPost(para).then((res) => {
              this.$message({
                message: '岗位添加成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.getPostList()
              this.showAddDialog = false
            })
          })
        }
      })
    },
    deletePost(data) {
      this.$confirm('确定删除该条岗位信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deletePost(data.id).then((res) => {
          this.getPostList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDeptList()
    },
    editSelect() {
      this.showEditForm(this.multipleSelection[0])
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
    deleteSelect() {
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条岗位信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        this.$store.state.common.isLoading = 1
        deletePosts(ids).then(res => {
          this.$store.state.common.isLoading = 0
          this.getPostList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#system-post{
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
