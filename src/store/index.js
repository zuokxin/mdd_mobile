import Vue from 'vue'
import Vuex from 'vuex'
import test from './modules/test'
import { getUserAuth, wxSignatures } from '@/api/index'
import { getUserInfo } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    wxReady: false,
    phone: ''
  },
  getters: {
    // 校验手机号码长度，因为有外国用户废弃
    // isLogin: () => (phone) => {
    //   // const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    //   return String(phone).length === 11
    // }
  },
  mutations: {
    INIT () {
      if (sessionStorage.tables) sessionStorage.removeItem('tables')
    },
    // 设置微信sdk状态
    SET_WX_READY (state, value) {
      state.wxReady = value
    },
    // 设置初始地址
    SET_INIT_URL (state, value) {
      state.initUrl = value
    },
    SET_PHONE (state, value) {
      state.phone = value
    }
  },
  actions: {
    // 微信sdk
    getWxConfig (context) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await wxSignatures({ url: context.state.initUrl })
          await wxShare.getWXSDK(res.data)
          context.commit('SET_WX_READY', true)
          resolve(false)
        } catch (err) {
          reject(err)
          console.log(err)
        }
      })
    },
    // 微信分享
    async addShare (context, data = {}, callback) {
      try {
        // 如果没有获取过sdk先请求
        if (!context.state.wxReady) {
          await context.dispatch('getWxConfig')
        }
        await wxShare.setShare(data)
        if (callback) callback()
      } catch (err) {
        console.log(err, 'store:微信分享加载失败')
      }
    },
    // 获得token
    getToken (context) {
      return new Promise((resolve, reject) => {
        getUserAuth().then(
          ({ data = {} }) => {
            const {
              phone
            } = data
            // localStorage.phone = phone
            context.commit('SET_PHONE', phone)
            resolve(data)
          }
        ).catch(
          err => {
            reject(err)
            context.commit('SET_PHONE', '')
            // 登录状态已过期状态下清空
            // if (err.code === 605) {
            //   localStorage.removeItem('phone')
            // }
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
