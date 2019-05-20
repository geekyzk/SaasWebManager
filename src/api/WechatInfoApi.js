import request from '@/utils/request'

export function listWechatInfo(params) {
  return request({
    url: '/api/wechatInfo',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createWechatInfo(data) {
  return request({
    url: '/api/wechatInfo',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateWechatInfo(id, data) {
  return request({
    url: '/api/wechatInfo/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteWechatInfo(id) {
  return request({
    url: '/api/wechatInfo/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
