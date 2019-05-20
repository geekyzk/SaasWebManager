import request from '@/utils/request'

export function listGoodsCategory(params) {
  return request({
    url: '/api/goodsCategory',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createGoodsCategory(data) {
  return request({
    url: '/api/goodsCategory',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateGoodsCategory(id, data) {
  return request({
    url: '/api/goodsCategory/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteGoodsCategory(id) {
  return request({
    url: '/api/goodsCategory/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
