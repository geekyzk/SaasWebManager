import request from '@/utils/request'

export function listGoods(params) {
  return request({
    url: '/api/goods',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function retrieveGoods(id) {
  return request({
    url: `/api/goods/${id}`,
    method: 'get',
    baseURL: process.env.BASE_API
  })
}

export function createGoods(data) {
  return request({
    url: '/api/goods',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateGoods(id, data) {
  return request({
    url: '/api/goods/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteGoods(id) {
  return request({
    url: '/api/goods/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
