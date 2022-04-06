import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    meta: { title: '复变云愈' },
    component: resolve => require(['../views/login/index.vue'], resolve)
  },
  {
    path: '/test-more',
    name: '更多测试',
    meta: { title: '测试' },
    component: resolve => require(['../views/test-more/index.vue'], resolve)
  },
  {
    path: '/test-detail',
    name: '量表详情',
    meta: { title: '量表详情' },
    component: resolve => require(['../views/test-detail/index.vue'], resolve)
  },
  {
    path: '/test-do-infos',
    name: '测试-个人信息',
    meta: { title: '填写个人信息' },
    component: resolve => require(['../views/test-do/test-do-infos/index.vue'], resolve)
  },
  {
    path: '/test-do-self',
    name: '测试-自评量表',
    meta: { title: '测试' },
    component: resolve => require(['../views/test-do/test-do-self/index.vue'], resolve)
  },
  {
    path: '/test-report',
    name: '测试-量表报告',
    component: resolve => require(['../views/test-do/test-report/index.vue'], resolve)
  },
  {
    path: '/test-do-wait',
    name: '测试-等待',
    meta: { title: '测试' },
    component: resolve => require(['../views/test-do/test-do-wait/index.vue'], resolve)
  },
  {
    path: '/my-contact',
    name: '我的-联系客服',
    meta: { title: '复变云愈' },
    component: resolve => require(['../views/my/my-contact/index.vue'], resolve)
  },
  {
    path: '/my-index',
    name: '我的',
    meta: { title: '复变云愈' },
    component: resolve => require(['../views/my/my-index/index.vue'], resolve)
  },
  {
    path: '/my-infos',
    name: '我的-个人信息',
    meta: { needLogin: true, title: '复变云愈' },
    component: resolve => require(['../views/my/my-infos/index.vue'], resolve)
  }
]

const router = new VueRouter({
  routes
})

let init = false
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title
  if (!init) {
    try {
      await store.dispatch('getToken')
      init = true
      next()
    } catch (err) {
      // 登录过期
      if (err.code === 605) {
        // init = false
        next()
      } else {
        next()
      }
    }
  } else {
    const phone = sessionStorage.getItem('phone')
    if (to.meta.needLogin) {
      if (!phone) {
        next({
          path: '/login'
        })
      } else {
        return next()
      }
    } else {
      return next()
    }
  }
})

export default router
