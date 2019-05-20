import request from '@/utils/request'

export function listOrderLogistics(params) {
  return request({
    url: '/api/orderLogistics',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createOrderLogistics(data) {
  return request({
    url: '/api/orderLogistics',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateOrderLogistics(id, data) {
  return request({
    url: '/api/orderLogistics/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteOrderLogistics(id) {
  return request({
    url: '/api/orderLogistics/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
