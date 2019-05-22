import store from './index'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.imageUrl,
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
    if (state.user.permissionNames.indexOf(name) === -1 && state.user.permissionNames.indexOf('ROLE_PLATFORM_ADMIN') === -1) {
      return false
    } else {
      return true
    }
  }
}
export default getters
