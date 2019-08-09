<template>
  <div id="lawyer-index">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
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
      
      <el-form-item>
        <el-button type="primary" size="medium" round icon="el-icon-search" @click="getList">查询</el-button>
        <el-button type="warning" size="medium" round icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table
        :data="tableData"
        class="tree-table"
        :header-cell-style="{background:'#EFF3F8'}"
        style="width:100%"
        fit
        highlight-current-row
      >
        <el-table-column
          prop="name"
          label="姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="areaText"
          label="区域"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="org"
          label="机构"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="lawNo"
          label="执业证号"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="更新时间"
          width="160"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
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
      title="编辑信息"
      :visible.sync="isEdit"
      center
    >
      <el-form ref="editForm" :model="editForm" label-width="150px">
        <el-form-item label="真实姓名" prop="name">
            <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="执业证号" prop="lawNo">
            <el-input v-model="editForm.lawNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="执业机构" prop="org">
            <el-input v-model="editForm.org" disabled></el-input>
        </el-form-item>
        <el-form-item label="执业机构区域" prop="area">
            <el-input v-model="editForm.area" disabled></el-input>
        </el-form-item>
        <el-form-item label="执业机构详细地址" prop="address">
            <el-input v-model="editForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="工作照">
            <el-avatar shape="square" :size="150" :src="editForm.avatar">
              <img :src="errorAvatarUrl"/>
            </el-avatar>
        </el-form-item>
      </el-form>

      <el-form ref="checkForm" :model="checkForm" label-width="150px">
        <el-form-item label="审核记录">
          <span style="color:#409eff; cursor:pointer" @click="checks">查看审核记录</span>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="checkForm.content">
          </el-input>
        </el-form-item>
        <el-form-item v-if="this.editForm.status === 'draft'" label="审核状态">
          <span style="font-weight:bold;">草稿</span>
         </el-form-item>
        <el-form-item v-if="this.editForm.status === 'failed'" label="审核状态">
          <span style="font-weight:bold;">未通过</span>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isEdit=false">取 消</el-button>
        <template v-if ="this.editForm.status === 'processing'">
          <el-button type="success" @click="checkPass">审核通过</el-button>
          <el-button type="warning" @click="check('failed')">审核不通过</el-button>
        </template>
         <el-button v-else-if="this.editForm.status === 'locked'" type="success" @click="check('pass')">解锁</el-button>
         <el-button v-else-if="this.editForm.status === 'pass'" type="danger" @click="check('locked')">锁定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, checkPass, check, checks } from '@/api/lawyer.js'

export default {
  data() {
    return {
      searchForm: {
        name: '',
        status: '',
        type: ''
      },
      editForm:{
        id:0,
        name:'',
        lawNo:'',
        org:'',
        area:'',
        address:'',
        avatar:'',
        comment:''
      },
      checkForm:{
        content:'',
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      total: 0,
      isEdit:false,
      errorAvatarUrl:require('@/assets/images/error-avatar.png'),
      flagLoading: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$store.state.common.isLoading = 1
      const para = Object.assign({ page: this.currentPage, size: this.pageSize }, this.searchForm)
      getList(para).then(res => {
        this.tableData = res.data.data
       // this.total = res.data.total
        this.$store.state.common.isLoading = 0
      })
    },
    showEdit(data){
      this.isEdit = true
      this.editForm.name = data.name
      this.editForm.lawNo = data.lawNo
      this.editForm.org = data.org
      this.editForm.address = data.address
      this.editForm.area = data.areaText
      this.editForm.avatar = data.avatar
      this.editForm.comment = data.comment
      this.editForm.status = data.status
      this.editForm.id = data.id
    },
    checkPass(){
      const para = Object.assign({lawyer_id:this.editForm.id, status:'pass'}, this.checkForm)
      checkPass(para).then(res => {
        this.isEdit = false
        this.getList()
      })
    },
    check(type){
      const para = Object.assign({lawyer_id:this.editForm.id, status:type}, this.checkForm)
      check(para).then(res => {
        this.isEdit = false
        this.getList()
      })
    },
    checks(){
      const para = Object.assign({}, {'lawyerId':this.editForm.id})
      checks(para).then(res => {
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getList()
    }
  }
}
</script>

<style lang="scss">
#lawyer-index{
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
}
</style>
