import ls from '@/utils/localStorage'
import permissions from '@/permissions'
import { login, getPermissions, logout, getUserInfo, getWhiteList } from '@/api/auth'

const state = {
  token: ls.getItem('token') || ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    ls.setItem('token', token)
  }
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
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then((res) => {
        const { roles, posts, name, avatar, email, createTime, deptName, phone, id, sex, loginName } = res.data
        if (roles && roles.length > 0) {
          permissions.SET_ROLES(roles)
        } else {
          reject('网络请求异常，请联系管理员！')
        }
        permissions.SET_NAME(name)
        permissions.SET_lOGIN_NAME(loginName)
        permissions.SET_AVATAR(avatar)
        permissions.SET_EMAIL(email)
        permissions.SET_CREATETIME(createTime)
        permissions.SET_DEPT(deptName)
        permissions.SET_PHONE(phone)
        permissions.SET_ID(id)
        permissions.SET_SEX(sex)
        permissions.SET_POSTS(posts)

        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPermissions({ commit }) {
    return new Promise((resolve, reject) => {
      getPermissions().then(res => {
        resolve(res.data.web)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getWhiteList({ commit }) {
    return new Promise((resolve, reject) => {
      getWhiteList().then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
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
