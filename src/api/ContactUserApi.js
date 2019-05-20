import request from '@/utils/request'

export function listContactUser(params) {
  return request({
    url: '/api/contactUser',
    method: 'get',
    params: params,
    baseURL: process.env.BASE_API
  })
}

export function createContactUser(data) {
  return request({
    url: '/api/contactUser',
    method: 'post',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function updateContactUser(id, data) {
  return request({
    url: '/api/contactUser/' + id,
    method: 'put',
    data: data,
    baseURL: process.env.BASE_API
  })
}

export function deleteContactUser(id) {
  return request({
    url: '/api/contactUser/' + id,
    method: 'delete',
    baseURL: process.env.BASE_API
  })
}
