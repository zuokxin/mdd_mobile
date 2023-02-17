import fetch from '../http.js'

export const getCode = params => fetch({
  url: '/api/user/getCode',
  method: 'get',
  params
}, false)

export const postUserLogin = (data) => fetch({
  url: '/api/user/login',
  method: 'post',
  data
})
// 退出登录
export const postLogout = () => fetch({
  url: '/api/admin/logout',
  method: 'post'
})

// 新用户奖励
export const newUserReward = () => fetch({
  url: '/api/user/newUserReward',
  method: 'post'
})
