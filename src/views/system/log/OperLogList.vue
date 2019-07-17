<template>
  <div id="oper-list">
    <el-form v-show="showSearchForm" ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="系统模块" prop="title">
        <el-input v-model="searchForm.title"></el-input>
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input v-model="searchForm.operName"></el-input>
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
      <el-form-item label="操作类型" prop="type">
        <el-select v-model="searchForm.type">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="item in dictOperType" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          prop="title"
          label="系统模块"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作类型"
          width="200"
        >
          <template slot-scope="scope">
            <template v-for="item in dictOperType">
              <el-tag
                v-if="scope.row.type == item.value"
                :key="item.value"
                size="small"
                :type="item.listClass"
              >{{ item.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="operName"
          label="操作人员"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="ip"
          label="主机"
          width="200"
        >
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template slot-scope="scope">
            <template v-for="item in dictSysStatus">
              <el-tag
                v-if="scope.row.status == item.value"
                :key="item.value"
                size="small"
                :type="item.listClass"
              >{{ item.label }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="operTime"
          label="操作时间"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="showLogDetail(scope.row)"
            >详细</el-button>
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
      title="操作日志详细"
      :visible.sync="showDetailDialog"
      center
    >
      <ul class="list">
        <li class="list-item">操作模块:<span class="item-info">{{ logDetail.title }}</span></li>
        <li class="list-item">登录信息:<span class="item-info">{{ logDetail.ip }}</span></li>
        <li class="list-item">请求地址:<span class="item-info">{{ logDetail.url }}</span></li>
        <li class="list-item">请求时间:<span class="item-info">{{ logDetail.operTime }}</span></li>
        <li class="list-item">请求参数:<pre class="item-info">{{ logDetail.operParam }}</pre></li>
        <li class="list-item">响应信息:<span class="item-info">{{ logDetail.msg }}</span></li>
        <li class="list-item">状态:<span class="item-info">
          <template v-for="item in dictSysStatus">
            <el-tag
              v-if="logDetail.status == item.value"
              :key="item.value"
              size="small"
              :type="item.listClass"
            >{{ item.label }}</el-tag>
          </template>
        </span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { getOperLogList, deleteOperLogs, emptyOperLogs } from '@/api/log.js'
import { selectDictDataByType } from '@/api/dict.js'
import { isRenderBtn } from '@/utils/common.js'
import permissions from '@/permissions.js'

export default {
  data() {
    return {
      deleteDisabled: true,
      showSearchForm: true,
      showListBtn: false,
      showDeleteBtn: false,
      showDetailDialog: false,
      logDetail: {},
      searchForm: {
        title: '',
        operName: '',
        type: ''
      },
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      total: 0,
      dictOperType: [],
      dictSysStatus: []
    }
  },
  mounted() {
    this.getLogList()
    this.selectDictOperType('sys_oper_type')
    this.selectDictSysStatus('sys_show_hide')
    this.renderBtn()
  },
  methods: {
    renderBtn() {
      const btnPerms = permissions.state.btnPermissions
      const loginId = permissions.info.id
      this.showListBtn = isRenderBtn(btnPerms, 'system:dict:search', loginId)
      this.showDeleteBtn = isRenderBtn(btnPerms, 'system:dict:delete', loginId)
    },
    selectDictOperType(type) {
      selectDictDataByType(type).then(res => {
        this.dictOperType = res.data
      })
    },
    selectDictSysStatus(type) {
      selectDictDataByType(type).then(res => {
        this.dictSysStatus = res.data
      })
    },
    getLogList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({ page: this.currentPage, size: this.pageSize }, this.searchForm)
      getOperLogList(para).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.$store.state.common.isLoading = 0
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
      this.$confirm(`确定删除选中的${this.multipleSelection.length}条操作日志信息吗?`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        this.$store.state.common.isLoading = 1
        deleteOperLogs(ids).then(res => {
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
        emptyOperLogs().then(res => {
          this.$store.state.common.isLoading = 0
          this.getLogList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    showLogDetail(data) {
      this.showDetailDialog = true
      this.logDetail = data
      this.logDetail.operParam = JSON.stringify(JSON.parse(data.operParam), null, 4)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getLogList()
    },
    editSelect() {
      this.showEditForm(this.multipleSelection[0])
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
#oper-list{
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
  .list{
    .list-item{
        color:#888;
        padding:10px 0;
      .item-info{
         color:#333;
         padding-left:10px;
      }
    }
    pre{
      display: block;
      padding: 9.5px;
      margin: 0 0 10px;
      font-size: 13px;
      line-height: 1.42857143;
      color: #333;
      word-break: break-all;
      word-wrap: break-word;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
      border-radius: 4px;
      height:150px;
      overflow: auto;
    }
  }
}
</style>
