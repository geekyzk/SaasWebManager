import request from '@/utils/request'

export function listGoodsImage(params) {
  return request({
    url: '/api/goodsImage',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createGoodsImage(data) {
  return request({
    url: '/api/goodsImage',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateGoodsImage(id, data) {
  return request({
    url: '/api/goodsImage/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteGoodsImage(id) {
  return request({
    url: '/api/goodsImage/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
