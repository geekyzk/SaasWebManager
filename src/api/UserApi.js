import request from '@/utils/request'

export function queryUserInfo(params) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function listUser(params) {
  return request({
    url: '/api/user',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function changePassword(data) {
  return request({
    url: '/api/user/password',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateUser(id, data) {
  return request({
    url: '/api/user/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteUser(id) {
  return request({
    url: '/api/user/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}

