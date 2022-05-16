import fetch from '../http.js'

export const getCode = phone => fetch({
  url: '/api/user/getCode',
  method: 'get',
  params: {
    phone
  }
})

export const postUserLogin = (data) => fetch({
  url: '/api/user/login',
  method: 'post',
  data
})

export const postAdminLogin = (data) => fetch({
  url: '/api/admin/login',
  method: 'post',
  data
})

export const postLogout = () => fetch({
  url: '/api/admin/logout',
  method: 'post'
})
// 医院内部系统医生登录
export const login = (data) => fetch({
  url: '/api/admin/login',
  method: 'post',
  data
})

// 新用户奖励
export const newUserReward = () => fetch({
  url: '/api/user/newUserReward',
  method: 'post'
})
