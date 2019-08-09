import request from './request.js'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getManagerInfo() {
  return request({
    url: '/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
