import request from '@/utils/request'

export function listBusinessConfig(params) {
  return request({
    url: '/api/businessConfig',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createBusinessConfig(data) {
  return request({
    url: '/api/businessConfig',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateBusinessConfig(id, data) {
  return request({
    url: '/api/businessConfig/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteBusinessConfig(id) {
  return request({
    url: '/api/businessConfig/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
