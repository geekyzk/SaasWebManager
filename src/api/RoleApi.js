import request from '@/utils/request'

export function listRole(params) {
  return request({
    url: '/api/role',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}
export function retriveRole(id) {
  return request({
    url: `/api/role/${id}/`,
    method: 'get',
    baseURL: process.env.BASE_API
  })
}

export function createRole(data) {
  return request({
    url: '/api/role',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateRole(id, data) {
  return request({
    url: '/api/role/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteRole(id) {
  return request({
    url: '/api/role/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
