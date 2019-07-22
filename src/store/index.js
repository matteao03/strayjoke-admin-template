import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import auth from './modules/auth'
import permissions from './modules/permissions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common,
    auth,
    permissions
  }
})

export default store
