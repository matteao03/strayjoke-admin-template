import request from './request.js'

export function getRoleList(query) {
  return request({
    url: '/api/roleList',
    method: 'get',
    params: query
  })
}
export function editRole(data) {
  return request({
    url: '/api/role',
    method: 'put',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}
export function deleteRole(id) {
  return request({
    url: `/api/role`,
    method: 'delete',
    params: { id }
  })
}
export function deleteRoleUsers(userIds, roleId) {
  return request({
    url: `/api/batchUserRole`,
    method: 'delete',
    params: { userIds, roleId }
  })
}
export function deleteUserRole(userId, roleId) {
  return request({
    url: `/api/userRole`,
    method: 'delete',
    params: { userId, roleId }
  })
}
export function relateUsersByRoleId(data) {
  return request({
    url: '/api/role/relateUsers',
    method: 'post',
    data
  })
}

export function deleteRoles(ids) {
  return request({
    url: `/api/roles`,
    method: 'delete',
    params: { ids }
  })
}

export function relateDataPermission(data) {
  return request({
    url: `/api/role/dataPermission`,
    method: 'put',
    data
  })
}
