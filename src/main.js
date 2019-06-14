import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import i18n from './lang'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import BooleanTag from './components/BooleanTag'
import ImageUpload from './components/ImageUpload'

/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
import { formatDate } from './utils'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('formatDate', function(value) { // 全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  if (value === undefined || value === '') {
    return ''
  }
  return formatDate(value, 'yyyy-MM-dd')
})

Vue.component('BooleanTag', BooleanTag)
Vue.component('ImageUpload', ImageUpload)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
