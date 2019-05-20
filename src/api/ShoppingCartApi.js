import request from '@/utils/request'

export function listShoppingCart(params) {
  return request({
    url: '/api/shoppingCart',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createShoppingCart(data) {
  return request({
    url: '/api/shoppingCart',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateShoppingCart(id, data) {
  return request({
    url: '/api/shoppingCart/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteShoppingCart(id) {
  return request({
    url: '/api/shoppingCart/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
