import ls from '@/utils/localStorage'

const state = {
  isCollapseNav: ls.getItem('isCollapseNav') || 0,
  isLoading: 0
}

const mutations = {
  SET_COLLAPSE_NAV: (state, val) => {
    state.isCollapseNav = val
    ls.setItem('isCollapseNav', val)
  },
  SET_IS_LOADING: (state, val) => {
    state.isCollapseNav = val
  }
}

export default {
  state,
  mutations
}
