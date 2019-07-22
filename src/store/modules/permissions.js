import { getPermissions} from '@/api/auth'

const state={
    routes:[],
    pagePermissions:[],
    btnPermissions:[]
}

const mutations= {
    SET_ROUTES: (state, value) => {
        state.routes = value
    },
    SET_PAGES: (state, value) => {
        state.pagePermissions = value
    },
    SET_BTNS: (state, value) => {
        state.btnPermissions = value
    },
}

const actions = {
    getPermissions({ commit }) {
      return new Promise((resolve, reject) => {
        getPermissions().then(res => {
          commit('SET_PAGES', res.data.pagePermissions) //存储页面权限
          commit('SET_BTNS', res.data.btnPermissions) //存储接口权限
          resolve(res.data)
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