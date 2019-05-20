import request from '@/utils/request'

export function listOrderGoods(params) {
  return request({
    url: '/api/orderGoods',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createOrderGoods(data) {
  return request({
    url: '/api/orderGoods',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateOrderGoods(id, data) {
  return request({
    url: '/api/orderGoods/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteOrderGoods(id) {
  return request({
    url: '/api/orderGoods/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
