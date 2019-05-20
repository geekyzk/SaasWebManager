import request from '@/utils/request'

export function listPermission(params) {
  return request({
    url: '/api/permission',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function listFormatPermission(params) {
  return request({
    url: '/api/permission/format',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createPermission(data) {
  return request({
    url: '/api/permission',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updatePermission(id, data) {
  return request({
    url: '/api/permission/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deletePermission(id) {
  return request({
    url: '/api/permission/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
