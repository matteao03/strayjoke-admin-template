import request from './request.js'

export function getPostList(query) {
  return request({
    url: '/api/postList',
    method: 'get',
    params: query
  })
}

export function editPost(data) {
  return request({
    url: '/api/Post',
    method: 'put',
    data
  })
}

export function addPost(data) {
  return request({
    url: '/api/Post',
    method: 'post',
    data
  })
}

export function deletePost(id) {
  return request({
    url: `/api/Post`,
    method: 'delete',
    params: { id }
  })
}

export function deletePosts(ids) {
  return request({
    url: `/api/posts`,
    method: 'delete',
    params: { ids }
  })
}

