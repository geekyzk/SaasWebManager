import request from '@/utils/request'

export function listLogisticsConfig(params) {
  return request({
    url: '/api/logisticsConfig',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createLogisticsConfig(data) {
  return request({
    url: '/api/logisticsConfig',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateLogisticsConfig(id, data) {
  return request({
    url: '/api/logisticsConfig/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteLogisticsConfig(id) {
  return request({
    url: '/api/logisticsConfig/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
