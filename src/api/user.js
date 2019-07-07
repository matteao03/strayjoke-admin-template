import request from './request.js'

export function getUserList(query) {
  return request({
    url: '/api/userList',
    method: 'get',
    params: query
  })
}

export function editUser(data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/user`,
    method: 'delete',
    params: { id }
  })
}

export function getUserById(id) {
  return request({
    url: `/api/user`,
    method: 'get',
    params: { id }
  })
}

export function getRoleRelatedUser(query) {
  return request({
    url: `/api/roleRelatedUser`,
    method: 'get',
    params: query
  })
}

export function getRoleNotRelatedUser(query) {
  return request({
    url: `/api/roleNotRelatedUser`,
    method: 'get',
    params: query
  })
}

export function resetPassword(data) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data
  })
}

export function changeUserOpen(data) {
  return request({
    url: `/api/user/open`,
    method: 'put',
    data
  })
}

export function deleteUsers(ids) {
  return request({
    url: `/api/users`,
    method: 'delete',
    params: { ids }
  })
}
