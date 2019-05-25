import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      name: 'home',
      meta: { title: '首页', icon: 'table' },
      component: () => import('@/views/dashboard/index')
    }, {
      path: 'ownConfig',
      hidden: true,
      component: () => import('@/views/center/BusinessConfig')
    }]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    name: 'goods',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'goodsList',
        component: () => import('@/views/goods/Goods'),
        meta: { title: '商品库存', icon: 'table' }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/goodscategory/GoodsCategory'),
        meta: { title: '商品类别', icon: 'tree' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/shop_store',
    name: 'shop',
    meta: { title: '店铺配置', icon: 'example' },
    children: [
      // {
      //   path: 'image_config',
      //   name: 'imageConfig',
      //   component: () => import('@/views/shopstoreimageconfig/ShopStoreImageConfig'),
      //   meta: { title: '图片配置', icon: 'table' }
      // },
      {
        path: 'shop_store',
        name: 'shopStore',
        component: () => import('@/views/shopstore/ShopStore'),
        meta: { title: '自提门店', icon: 'tree' }
      }
      // {
      //   path: 'wechat',
      //   name: 'wechat',
      //   component: () => import('@/views/wechatinfo/WechatInfo'),
      //   meta: { title: '微信配置', icon: 'tree' }
      // }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'shop',
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'orderList',
        component: () => import('@/views/OrderManager/OrderInfo'),
        meta: { title: '订单列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'customerList',
        component: () => import('@/views/user/Customer'),
        meta: { title: '客户管理', icon: 'table' }
      },
      {
        path: 'user-list',
        name: 'systemUserList',
        component: () => import('@/views/user/User'),
        meta: { title: '员工管理', icon: 'table' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/user/Role'),
        meta: { title: '角色管理', icon: 'table' }
      }
    ]
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   name: 'system',
  //   meta: { title: '系统设置', icon: 'example' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/user/user'),
  //       meta: { title: '用户列表', icon: 'table' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/role/role'),
  //       meta: { title: '角色列表', icon: 'tree' }
  //     },
  //     {
  //       path: 'permission',
  //       name: 'permission',
  //       component: () => import('@/views/permission/permission'),
  //       meta: { title: '权限列表', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/user/user'),
  //       meta: { title: 'user', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
