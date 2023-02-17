import Vue from 'vue'
import Vuex from 'vuex'
import test from './modules/test'
import { getUserAuth } from '@/api/index'
import { getUserInfo } from '@/api/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    isLogin: () => (phone) => {
      // const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      return String(phone).length === 11
    }
  },
  mutations: {
    INIT () {
      if (sessionStorage.tables) sessionStorage.removeItem('tables')
    }
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
            localStorage.phone = phone
            localStorage.openid = openid
            resolve(data)
          }
        ).catch(
          err => {
            reject(err)
            // 登录状态已过期状态下清空
            if (err.code === 605) {
              localStorage.removeItem('phone')
              localStorage.removeItem('openid')
            }
          }
        )
      })
    },
    getInfo () {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  modules: {
    test
  }
})
