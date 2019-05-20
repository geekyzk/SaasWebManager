import request from '@/utils/request'

export function listIndexLayout(params) {
  return request({
    url: '/api/indexLayout',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createIndexLayout(data) {
  return request({
    url: '/api/indexLayout',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateIndexLayout(id, data) {
  return request({
    url: '/api/indexLayout/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteIndexLayout(id) {
  return request({
    url: '/api/indexLayout/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
