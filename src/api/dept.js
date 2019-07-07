import request from './request.js'

export function getDeptList(query) {
  return request({
    url: '/api/deptList',
    method: 'get',
    params: query
  })
}

export function editDept(data) {
  return request({
    url: '/api/dept',
    method: 'put',
    data
  })
}

export function addDept(data) {
  return request({
    url: '/api/dept',
    method: 'post',
    data
  })
}

export function deleteDept(id) {
  return request({
    url: `/api/dept`,
    method: 'delete',
    params: { id }
  })
}

export function getCheckedDeptList(query) {
  return request({
    url: '/api/checkedDeptList',
    method: 'get',
    params: query
  })
}
