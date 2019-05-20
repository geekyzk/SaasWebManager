import request from '@/utils/request'

export function listUserAddress(params) {
  return request({
    url: '/api/userAddress',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createUserAddress(data) {
  return request({
    url: '/api/userAddress',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateUserAddress(id, data) {
  return request({
    url: '/api/userAddress/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteUserAddress(id) {
  return request({
    url: '/api/userAddress/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
