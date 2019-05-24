import { login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { queryUserInfo } from '@/api/UserApi'
import { listBusinessConfig } from '@/api/BusinessConfigApi'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: '',
    businessConfig: {
      name: '',
      shopName: ''
    },
    permissions: [],
    permissionNames: [],
    hasBusinessAdmin: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_USER_PERMISSIONS: (state, roles) => {
      if (roles === '' || roles.length === 0) {
        state.permissions = []
      } else {
        const permissions = []
        const permissionNames = []
        roles.forEach(element => {
          element.permissions.forEach(p => {
            permissions.push(p)
            permissionNames.push(p.name)
          })
        })
        state.permissions = permissions
        state.permissionNames = permissionNames
      }
    },
    SET_HAS_BUSINESS_ADMIN: (state, isAdmin) => {
      state.hasBusinessAdmin = isAdmin
    },
    SET_BUSINESS_CONFIG: (state) => {
      listBusinessConfig({ size: 1 }).then(resp => {
        state.businessConfig = resp.data.data[0]
      })
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, false).then(response => {
          const data = response.data.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_BUSINESS_CONFIG')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetBusinessConfig({ commit }) {
      commit('SET_BUSINESS_CONFIG')
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        queryUserInfo().then(response => {
          console.log(response)
          const data = response.data
          if (data.id !== undefined) { // 验证返回的roles是否是一个非空数组
            commit('SET_USER_INFO', data)
            commit('SET_USER_PERMISSIONS', data.roles)
          } else {
            reject('Get userInfo fail')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER_INFO', '')
        removeToken()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
