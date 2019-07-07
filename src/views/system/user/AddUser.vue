<template>
  <div class="add-user">
    <el-form ref="form" inline :model="form" label-width="80px" class="add-form" label-position="left" :rules="rules">
      <div class="base-info">
        <p class="title">基本信息</p>
        <p class="line"></p>
      </div>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="归属部门" prop="deptId">
            <input :value="form.deptId" type="hidden">
            <el-input v-model="form.deptName" @focus="showDept">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="登录账号" prop="loginName">
            <el-input v-model="form.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="用户状态">
            <el-switch
              v-model="form.status"
              style="display: block;line-height:36px;"
              active-color="#409eff"
              inactive-color="#dddddd"
              :active-value="0"
              :inactive-value="1"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="岗位" prop="posts">
            <el-select v-model="form.posts" multiple>
              <el-option
                v-for="item in postList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="用户性别">
            <el-radio v-model="form.sex" :label="1">男</el-radio>
            <el-radio v-model="form.sex" :label="2">女</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" :offset="1">
          <el-form-item label="角色" prop="role">
            <el-checkbox-group v-model="form.role">
              <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="base-info other-info">
        <p class="title">其他信息</p>
        <p class="line"></p>
      </div>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="备注" prop="remark" class="textarea-item">
            <el-input v-model="form.remark" type="textarea" :row="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="btn-container">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="closePage">关闭</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="选择部门"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <z-tree
        container="search-tree"
        search-container="search-dept"
        show-search
        :show-title="false"
        :tree-data="deptList"
        is-collapse
        @changeEmpl="changeEmpl"
      ></z-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectDept">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ZTree from '@/components/ZTree.vue'
import { getRoleList } from '@/api/role.js'
import { getDeptList } from '@/api/dept.js'
import { getPostList } from '@/api/post.js'
import { addUser } from '@/api/user.js'
import bus from '@/utils/bus'

export default {
  components: {
    ZTree
  },
  data() {
    return {
      dialogVisible: false,
      selectedNode: {},
      form: {
        name: '',
        loginName: '',
        deptId: '',
        deptName: '',
        phone: '',
        status: 0,
        sex: 1,
        email: '',
        role: [],
        remark: '',
        posts: []
      },
      roleList: [],
      deptList: [],
      postList: [], // 岗位
      rules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        deptId: [{ required: true, message: '请输入归属部门', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        loginName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getDeptList()
    this.getPostList()
  },
  methods: {
    getRoleList() {
      getRoleList({}).then(response => {
        this.roleList = response.data
      })
    },
    getDeptList() {
      getDeptList({}).then(response => {
        this.deptList = response.data
      })
    },
    getPostList() {
      getPostList({ 'status': '0' }).then(response => {
        this.postList = response.data
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$store.state.common.isLoading = 1
            const para = Object.assign({}, this.form)
            addUser(para).then((res) => {
              this.$store.state.common.isLoading = 0
              this.$message({
                message: res.msg,
                type: 'success'
              })
            })
          })
        }
      })
    },
    showDept() {
      this.dialogVisible = true
    },
    changeEmpl(node) {
      this.selectedNode = node
    },
    selectDept() {
      this.form.deptId = this.selectedNode.id
      this.form.deptName = this.selectedNode.name
      this.dialogVisible = false
    },
    closePage() {
      bus.$emit('close-tag', this.$router)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-user{
    padding:10px 15px;
    height:100%;
    overflow: auto;
    .base-info{
        padding-bottom:20px;
        .title{
            padding:5px 0;
            text-align: left;
            color:#409eff;
        }
        .line{
          height:1px;
          width:100%;
          background-color:#ddd;
        }
    }
    .other-info{
      margin-bottom:20px;
    }
    .btn-container{
      margin-top:20px;
      text-align: center;
    }
}
</style>

<style lang="scss">
.textarea-item{
  width:100%;
  .el-form-item__content{
    width:calc(100% - 80px);
    .el-textarea{
      width:100%;
    }
  }
}
</style>

