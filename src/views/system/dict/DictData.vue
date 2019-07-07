<template>
  <div id="dict-list">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="字典名称" prop="type">
        <el-input v-model="searchForm.type"></el-input>
      </el-form-item>
      <el-form-item label="字典标签" prop="label">
        <el-input v-model="searchForm.label"></el-input>
      </el-form-item>
      <el-form-item label="数据状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="部门状态">
          <el-option label="所有" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getDictDataList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button v-if="showAddBtn" type="primary" icon="el-icon-plus" size="medium" @click="showAddForm">新增</el-button>
        <el-button v-if="showEditBtn" type="success" icon="el-icon-edit-outline" size="medium" :disabled="editDisabled" @click="editSelect">修改</el-button>
        <el-button v-if="showDeleteBtn" type="info" icon="el-icon-delete" size="medium" :disabled="deleteDisabled" @click="deleteSelect">删除</el-button>
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
          prop="code"
          label="字典编号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="label"
          label="字典标签"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="value"
          label="字典键值"
          width="150"
        >
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="info" size="small">{{ formatStatus(scope.row.status) }}</el-tag>
            <el-tag v-else size="small" type="">{{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="250"
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
              @click="deleteDictData(scope.row.code)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog
      title="编辑字典"
      :visible.sync="showEditDialog"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="editForm.label"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="editForm.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="editForm.status" label="0">正常</el-radio>
          <el-radio v-model="editForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="editForm.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDictData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加字典"
      :visible.sync="showAddDialog"
    >
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="addForm.label"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="addForm.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="addForm.status" label="0">正常</el-radio>
          <el-radio v-model="addForm.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="addForm.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDictData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDictDataList, editDictData, addDictData, deleteDictData, deleteDictDatas } from '@/api/dict.js'
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
      deleteDisabled: true,
      showAddDialog: false,
      showEditDialog: false,
      addForm: {
        name: '',
        type: '',
        status: '0',
        remark: ''
      },
      editForm: {
        label: '',
        type: '',
        status: '0',
        remark: '',
        value: ''
      },
      searchForm: {
        type: '',
        status: '',
        label: ''
      },
      tableData: [],
      multipleSelection: [],
      rules: {
        label: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
        type: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.searchForm.type = this.$route.query.type
    this.getDictDataList()
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:dict:list', loginId)
      this.showAddBtn = isRenderBtn(btnPerms, 'system:dict:add', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:dict:delete', loginId)
      this.showEditBtn = isRenderBtn(btnPerms, 'system:dict:edit', loginId)
    },
    formatStatus: function(value) {
      return value === '0' ? '正常' : '停用'
    },
    showEditForm(data) {
      this.showEditDialog = true
      this.editForm.code = data.code
      this.editForm.label = data.label
      this.editForm.type = data.type
      this.editForm.value = data.value
      this.editForm.remark = data.remark
      this.editForm.status = data.status
    },
    showAddForm() {
      this.showAddDialog = true
      this.addForm.type = this.$route.query.type
    },
    getDictDataList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({}, this.searchForm)
      getDictDataList(para).then(res => {
        this.tableData = res.data
        this.$store.state.common.isLoading = 0
      })
    },
    editDictData() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.editForm)
            editDictData(para).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.getDictDataList()
              this.showEditDialog = false
            })
          })
        }
      })
    },
    addDictData() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.addForm)
            addDictData(para).then((res) => {
              this.$message({
                message: '字典添加成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.getDictDataList()
              this.showAddDialog = false
            })
          })
        }
      })
    },
    deleteDictData(code) {
      this.$confirm('确定删除该条字典信息吗?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        deleteDictData(code).then((res) => {
          this.getDictDataList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDictDataList()
    },
    editSelect() {
      this.showEditForm(this.multipleSelection[0])
    },
    deleteSelect() {
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条字典数据吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const codes = []
        this.multipleSelection.forEach((item) => {
          codes.push(item.code)
        })
        this.$store.state.common.isLoading = 1
        deleteDictDatas(codes).then(res => {
          this.$store.state.common.isLoading = 0
          this.getDictDataList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
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
