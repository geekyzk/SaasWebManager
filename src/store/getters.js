import store from './index'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  businessConfig: state => state.user.businessConfig,
  hasBusinessAdmin: (state) => {
    if (state.user.userInfo !== '') {
      console.log(state.user.userInfo)
      return state.user.userInfo.isBusinessAdmin
    } else {
      return false
    }
  },
  permissions: (state) => state.user.permissions,
  permissionNames: (state) => state.user.permissionNames,
  checkUserPermissions: (state) => (name) => {
    console.log('判断权限')
    console.log('------' + state.user.hasBusinessAdmin)
    console.log('判断权限')
    if (store.getters.userInfo.isBusinessAdmin) {
      return true
    } else {
      if (store.getters.permissionNames.indexOf(name) === -1) {
        return false
      } else {
        return true
      }
    }
  }
}
export default getters
