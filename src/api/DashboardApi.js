import request from '@/utils/request'

export function queryTopInfo() {
  return request({
    url: '/api/dashboard/top',
    method: 'get',
    baseURL: process.env.BASE_API
  })
}


export function queryHotGoods() {
  return request({
    url: '/api/dashboard/hotGoods',
    method: 'get',
    baseURL: process.env.BASE_API
  })
}