import request from '@/utils/request.js'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get'
  })
}

export function getPermissions() {
  return request({
    url: '/api/auth/permissions',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}

export function editProfile(data) {
  return request({
    url: '/api/auth/profile',
    method: 'put',
    data
  })
}

export function editPassword(data) {
  return request({
    url: '/api/auth/password',
    method: 'put',
    data
  })
}

export function editAvatar(data) {
  return request({
    url: '/api/auth/avatar',
    method: 'put',
    data
  })
}
