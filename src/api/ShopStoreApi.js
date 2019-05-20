import request from '@/utils/request'

export function listShopStore(params) {
  return request({
    url: '/api/shopStore',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createShopStore(data) {
  return request({
    url: '/api/shopStore',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateShopStore(id, data) {
  return request({
    url: '/api/shopStore/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteShopStore(id) {
  return request({
    url: '/api/shopStore/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
