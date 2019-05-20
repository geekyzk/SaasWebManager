import request from '@/utils/request'

export function listShopStoreImageConfig(params) {
  return request({
    url: '/api/shopStoreImageConfig',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createShopStoreImageConfig(data) {
  return request({
    url: '/api/shopStoreImageConfig',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateShopStoreImageConfig(id, data) {
  return request({
    url: '/api/shopStoreImageConfig/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteShopStoreImageConfig(id) {
  return request({
    url: '/api/shopStoreImageConfig/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
