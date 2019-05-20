import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import store from './store'
NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.businessConfig === undefined || store.getters.businessConfig.name === '') {
        store.dispatch('GetBusinessConfig')
      }
      // next()
      
      if (store.getters.userInfo === '') {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          store.commit('SET_HAS_BUSINESS_ADMIN',res.isBusinessAdmin)
        }).then(()=> {
          next({ ...to, replace: true })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            console.log(err)
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
