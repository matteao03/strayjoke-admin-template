import request from './request.js'

export function getDictList(query) {
  return request({
    url: '/api/dictList',
    method: 'get',
    params: query
  })
}
export function editDict(data) {
  return request({
    url: '/api/dict',
    method: 'put',
    data
  })
}
export function addDict(data) {
  return request({
    url: '/api/dict',
    method: 'post',
    data
  })
}
export function deleteDict(id) {
  return request({
    url: `/api/dict`,
    method: 'delete',
    params: { id }
  })
}

export function getDictDataList(query) {
  return request({
    url: '/api/dictDataList',
    method: 'get',
    params: query
  })
}

export function editDictData(data) {
  return request({
    url: '/api/dictData',
    method: 'put',
    data
  })
}

export function addDictData(data) {
  return request({
    url: '/api/dictData',
    method: 'post',
    data
  })
}

export function deleteDictData(id) {
  return request({
    url: `/api/dictData`,
    method: 'delete',
    params: { id }
  })
}

export function deleteDictDatas(ids) {
  return request({
    url: `/api/dictDatas`,
    method: 'delete',
    params: { ids }
  })
}

