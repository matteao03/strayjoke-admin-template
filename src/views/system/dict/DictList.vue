<template>
  <div id="dict-list">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="type">
        <el-input v-model="searchForm.type"></el-input>
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
      <el-form-item label="字典状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="部门状态">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getDictList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddDialog = true">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
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
          label="字典名称"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="字典类型"
          width="200"
        >
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="info" size="small">{{ formatStatus(scope.row.status) }}</el-tag>
            <el-tag v-else size="small" type="">{{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
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
              size="mini"
              type="warning"
              @click="showDictData(scope.row.type)"
            >列表</el-button>
            <el-button
              v-if="showDeleteBtn"
              size="mini"
              type="danger"
              @click="deleteDict(scope.row.id)"
            >删除</el-button>
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

    <el-dialog
      title="编辑字典"
      :visible.sync="showEditDialog"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="editForm.status" label="0">正常</el-radio>
          <el-radio v-model="editForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDict">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加字典"
      :visible.sync="showAddDialog"
    >
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="addForm.status" label="0">正常</el-radio>
          <el-radio v-model="addForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDict">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictList, editDict, addDict, deleteDict } from '@/api/dict.js'
import { isRenderBtn } from '@/utils/common.js'
import permissions from '@/permissions.js'

export default {
  data() {
    return {
      showSearchForm: true,
      showListBtn: false,
      showAddBtn: false,
      showEditBtn: false,
      showDeleteBtn: false,
      editDisabled: true,
      showAddDialog: false,
      showEditDialog: false,
      addForm: {
        name: '',
        type: '',
        status: '0',
        remark: ''
      },
      editForm: {
        name: '',
        type: '',
        status: '0',
        remark: ''
      },
      searchForm: {
        name: '',
        status: '',
        type: ''
      },
      tableData: [],
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
      },
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      total: 0
    }
  },
  mounted() {
    this.getDictList()
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:dict:search', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:dict:add', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:dict:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:dict:edit', loginId)
    },
    formatStatus: function(value) {
      return value === '0' ? '正常' : '停用'
    },
    showEditForm(data) {
      this.showEditDialog = true
      this.editForm.id = data.id
      this.editForm.name = data.name
      this.editForm.type = data.type
      this.editForm.remark = data.remark
      this.editForm.status = data.status
    },
    getDictList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({ page: this.currentPage, size: this.pageSize }, this.searchForm)
      getDictList(para).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.$store.state.common.isLoading = 0
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getDictList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDictList()
    },
    editDict() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({ }, this.editForm)
            editDict(para).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.getDictList()
              this.showEditDialog = false
            })
          })
        }
      })
    },
    addDict() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.addForm)
            addDict(para).then((res) => {
              this.$message({
                message: '字典添加成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.getDictList()
              this.showAddDialog = false
            })
          })
        }
      })
    },
    deleteDict(id) {
      this.$confirm('确定删除该条字典信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteDict(id).then((res) => {
          this.getDictList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    showDictData(type) {
      this.$router.push(`dictData?type=${type}`)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDictList()
    },
    editSelect() {
      this.showEditForm(this.multipleSelection[0])
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
#dict-list{
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
  .block-pagination{
    padding:20px 0 15px;
  }
}
</style>
