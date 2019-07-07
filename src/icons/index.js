import Vue from 'vue'
import IconSvg from '@/components/IconSvg'

Vue.component('icon-svg', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/icons/', false, /\.svg$/)
requireAll(req)
