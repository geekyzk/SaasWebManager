import request from '@/utils/request'

export function listOrderInfo(params) {
  return request({
    url: '/api/orderInfo',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createOrderInfo(data) {
  return request({
    url: '/api/orderInfo',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateOrderInfo(id, data) {
  return request({
    url: '/api/orderInfo/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteOrderInfo(id) {
  return request({
    url: '/api/orderInfo/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
