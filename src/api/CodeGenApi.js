import request from '@/utils/request'

export function genEntity(data) {
  return request({
    url: '/api/gen',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}
