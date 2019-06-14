import request from '@/utils/request'

export function listCoupon(params) {
  return request({
    url: '/api/coupon',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createCoupon(data) {
  return request({
    url: '/api/coupon',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateCoupon(id, data) {
  return request({
    url: '/api/coupon/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteCoupon(id) {
  return request({
    url: '/api/coupon/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
