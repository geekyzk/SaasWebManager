import request from '@/utils/request'

export function login(username, password, rememberMe) {
  return request({
    url: '/api/authenticate',
    method: 'post',
    data: {
      username,
      password,
      rememberMe,
      loginType: 'memory'
    },
    baseURL: process.env.BASE_API
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
