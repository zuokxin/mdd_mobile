import Vue from 'vue'
import Vuex from 'vuex'
import { getUserAuth } from '@/api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    isLogin: () => (phone) => {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      return reg.test(phone)
    }
  },
  mutations: {
  },
  actions: {
    // 获得token
    getToken () {
      return new Promise((resolve, reject) => {
        getUserAuth().then(
          ({ data = {} }) => {
            const {
              phone,
              openid
            } = data
            sessionStorage.phone = phone
            sessionStorage.openid = openid
            resolve(data)
          }
        ).catch(
          err => {
            reject(err)
            // 登录状态已过期状态下清空
            if (err.code === 605) {
              sessionStorage.removeItem('phone')
              sessionStorage.removeItem('openid')
            }
          }
        )
      })
    }
  },
  modules: {
  }
})
