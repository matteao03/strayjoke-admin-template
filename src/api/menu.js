import request from './request.js'

export function getMenuList(query) {
  return request({
    url: '/api/menuList',
    method: 'get',
    params: query
  })
}
export function editMenu(data) {
  return request({
    url: '/api/menu',
    method: 'put',
    data
  })
}
export function addMenu(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    data
  })
}
export function deleteMenu(id) {
  return request({
    url: `/api/menu`,
    method: 'delete',
    params: { id }
  })
}
export function changeMenuOpen(data) {
  return request({
    url: `/api/menu/open`,
    method: 'put',
    data
  })
}
export function getCheckedMenuList(query) {
  return request({
    url: '/api/checkedMenuList',
    method: 'get',
    params: query
  })
}

