import ls from '@/utils/localStorage'
import { login, logout, getUserInfo } from '@/api/auth'

const state = {
  token: ls.getItem('token') || '',
  roles:[],
  name:'',
  loginName:'',
  dept:'',
  phone:'',
  email:'',
  sex:'',
  id:0,
  createTime:'',
  avatar:'',
  posts:[]
}

const mutations = {
  SET_TOKEN: (state, value) => {
    state.token = value
    ls.setItem('token', value)
  },
  SET_ROLES: (state, value) => {
    state.roles = value
  },
  SET_NAME: (state, value) => {
    state.name = value
  },
  SET_lOGIN_NAME: (state, value) => {
    state.loginName = value
  },
  SET_AVATAR: (state, value) => {
    state.avatar = value
  },
  SET_CREATETIME: (state, value) => {
    state.createTime = value
  },
  SET_EMAIL: (state, value) => {
    state.email = value
  },
  SET_SEX: (state, value) => {
    state.sex = value
  },
  SET_PHONE: (state, value) => {
    state.phone = value
  },
  SET_DEPT: (state, value) => {
    state.dept = value
  },
  SET_POSTS: (state, value) => {
    state.posts = value
  },
  SET_ID: (state, value) => {
    state.id = value
  },
}

const actions = {
  login({ commit }, form) {
    return new Promise((resolve, reject) => {
      login(form).then(res => {
        commit('SET_TOKEN', res.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //获取用户信息
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then((res) => {
        const { roles, posts, name, avatar, email, createTime, deptName, phone, id, sex, loginName } = res.data
        if (roles && roles.length > 0) {
          commit('SET_ROLES', roles)
        } else {
          reject('网络请求异常，请联系管理员！')
        }
        
        commit('SET_NAME', name)        
        commit('SET_lOGIN_NAME', loginName)        
        commit('SET_AVATAR', avatar)        
        commit('SET_EMAIL', email)        
        commit('SET_CREATETIME', createTime)        
        commit('SET_DEPT', deptName)        
        commit('SET_PHONE', phone)        
        commit('SET_ID', id)        
        commit('SET_SEX', sex)        
        commit('SET_POSTS', posts)
        
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        ls.removeItem('token') // 删除token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
