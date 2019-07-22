<template>
  <div id="log-list">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input v-model="searchForm.ipaddr"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="searchForm.loginName"></el-input>
      </el-form-item>
      <el-form-item label="登录时间" prop="start_at">
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
      <el-form-item label="登录状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="部门状态">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="item in dictData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="showListBtn" type="primary" size="medium" round icon="el-icon-search" @click="getLogList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="btn-dom">
        <el-button type="warning" icon="el-icon-close" size="medium" :disabled="deleteDisabled" @click="deleteLogs">删除</el-button>
        <el-button type="danger" icon="el-icon-delete" size="medium" @click="emptyLogs">清空</el-button>
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
          prop="loginName"
          label="登录名称"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="ipaddr"
          label="登录地址"
          width="250"
        >
        </el-table-column>
        <el-table-column label="登录状态" prop="status" width="200">
          <template slot-scope="scope">
            <template v-for="item in dictData">
              <el-tag
                v-if="scope.row.status === item.value"
                :key="item.value"
                size="small"
                :type="item.listClass"
              >{{ item.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="msg"
          label="备注"
          width="250"
        >
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="登录时间"
        >
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
</template>

<script>
import { getLoginLogList, deleteLoginLogs, emptyLoginLogs } from '@/api/log.js'
import { selectDictDataByType } from '@/api/dict.js'
import { isRenderBtn } from '@/utils/common.js'

export default {
  data() {
    return {
      deleteDisabled: true,
      showSearchForm: true,
      showListBtn: false,
      showDeleteBtn: false,
      searchForm: {
        ipaddr: '',
        status: '',
        loginName: ''
      },
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      total: 0
    }
  },
  mounted() {
    this.getLogList()
    this.selectDictDataByType('sys_common_status')
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = this.$store.state.btnPermissions
      const loginId = this.$store.state.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:loginLog:search', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:loginLog:delete', loginId)
    },
    formatStatus: function(value) {
      return value === '0' ? '正常' : '停用'
    },
    getLogList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({ page: this.currentPage, size: this.pageSize }, this.searchForm)
      getLoginLogList(para).then(res => {
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
    handleSizeChange(val) {
      this.pageSize = val
      this.getLogList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLogList()
    },
    deleteLogs() {
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条登录日志信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        this.$store.state.common.isLoading = 1
        deleteLoginLogs(ids).then(res => {
          this.$store.state.common.isLoading = 0
          this.getLogList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    emptyLogs() {
      this.$confirm(`确定清空所有登录日志信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.state.common.isLoading = 1
        emptyLoginLogs().then(res => {
          this.$store.state.common.isLoading = 0
          this.getLogList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getLogList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.deleteDisabled = true
      if (this.multipleSelection.length >= 1) {
        this.deleteDisabled = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#log-list{
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
