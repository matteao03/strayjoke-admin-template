import request from './request.js'

export function getList(query) {
  return request({
    url: '/lawyers',
    method: 'get',
    params: query
  })
}

export function check(data) {
  return request({
    url: '/lawyer/check',
    method: 'post',
    data
  })
}

export function checkPass(data) {
  return request({
    url: '/lawyer/check',
    method: 'post',
    data
  })
}

export function checks(query) {
  return request({
    url: '/lawyerChecks',
    method: 'get',
    params:query
  })
}
