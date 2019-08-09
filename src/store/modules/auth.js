import ls from '@/utils/localStorage'
import { login, logout, getManagerInfo } from '@/api/auth'

const state = {
  token: ls.getItem('token') || '',
  nickName:'',
  loginName:'',
  phone:'',
  email:'',
  sex:'',
  id:0,
  createTime:'',
  avatar:''
}

const mutations = {
  SET_TOKEN: (state, value) => {
    state.token = value
    ls.setItem('token', value)
  },
  SET_NICK_NAME: (state, value) => {
    state.nickName = value
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
  SET_ID: (state, value) => {
    state.id = value
  },
}

const actions = {
  login({ commit }, form) {
    return new Promise((resolve, reject) => {
      login(form).then(res => {
           commit('SET_TOKEN', res.data.access_token)
           resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //获取用户信息
  getManagerInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getManagerInfo().then((res) => {
        const { nick_name, avatar, email, created_at, phone, id, sex, login_name } = res.data
        if (id) {
          commit('SET_ID', id)
        } else {
          reject('网络请求异常，请联系管理员！')
        }
        
        commit('SET_NICK_NAME', nick_name)        
        commit('SET_lOGIN_NAME', login_name)        
        commit('SET_AVATAR', avatar)        
        commit('SET_EMAIL', email)        
        commit('SET_CREATETIME', created_at)        
        commit('SET_PHONE', phone)        
        commit('SET_SEX', sex)        
        
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
