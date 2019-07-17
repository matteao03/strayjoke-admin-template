import request from './request.js'

// 获取登录日志列表
export function getLoginLogList(query) {
  return request({
    url: '/api/loginLogList',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function deleteLoginLogs(ids) {
  return request({
    url: `/api/loginLog`,
    method: 'delete',
    params: { ids }
  })
}

// 清空登录日志
export function emptyLoginLogs() {
  return request({
    url: `/api/allLoginLogs`,
    method: 'delete'
  })
}

// 获取操作日志列表
export function getOperLogList(query) {
  return request({
    url: '/api/operLogList',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function deleteOperLogs(ids) {
  return request({
    url: `/api/operLog`,
    method: 'delete',
    params: { ids }
  })
}

// 清空操作日志
export function emptyOperLogs() {
  return request({
    url: `/api/allOperLogs`,
    method: 'delete'
  })
}

