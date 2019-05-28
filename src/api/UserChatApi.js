import request from '@/utils/request'

export function listUserChat(params) {
  return request({
    url: '/api/userChat',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function listUserChatGroup(params) {
  return request({
    url: '/api/userChat/group',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createUserChat(data) {
  return request({
    url: '/api/userChat',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateUserChat(id, data) {
  return request({
    url: '/api/userChat/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteUserChat(id) {
  return request({
    url: '/api/userChat/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
