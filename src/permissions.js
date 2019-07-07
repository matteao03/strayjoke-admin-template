const permissions = {
  info: {
    id: '',
    name: '未登录',
    loginName: '',
    email: '',
    phone: '',
    dept: '',
    avatar: '',
    sex: '',
    createTime: ''
  },
  state: {
    roles: [],
    posts: [],
    routes: [],
    addRoutes: [],
    btnPermissions: [],
    pagePermissions: [],
    whiteList: ''
  },
  SET_ID: function(id) {
    this.info.id = id
  },
  SET_NAME: function(name) {
    this.info.name = name
  },
  SET_lOGIN_NAME: function(loginName) {
    this.info.loginName = loginName
  },
  SET_SEX: function(sex) {
    this.info.sex = sex
  },
  SET_EMAIL: function(email) {
    this.info.email = email
  },
  SET_PHONE: function(phone) {
    this.info.phone = phone
  },
  SET_DEPT: function(dept) {
    this.info.dept = dept
  },
  SET_AVATAR: function(avatar) {
    this.info.avatar = avatar
  },
  SET_CREATETIME: function(createTime) {
    this.info.createTime = createTime
  },
  SET_ROLES: function(roles) {
    this.state.roles = roles
  },
  SET_POSTS: function(posts) {
    this.state.posts = posts
  },
  SET_ROUTES: function(data) {
    this.state.addRoutes = data.pagePermissions
    this.state.routes = data.routes
    this.state.btnPermissions = data.btnPermissions
    this.state.pagePermissions = data.pagePermissions
  },
  SET_WHITE_LIST: function(data) {
    this.state.whiteList = data.pagePermissions
    this.state.addRoutes = data.pagePermissions
    this.state.routes = data.routes
  }
}

export default permissions
