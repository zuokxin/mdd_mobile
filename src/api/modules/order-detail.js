import fetch from '../http.js'
// 订单详情获取批次
export const batchInfo = params => fetch({
  url: '/api/batch/info',
  method: 'get',
  params
}, false)
// 订单详情获取下是否需要绑定
export const batchTables = params => fetch({
  url: '/api/user/last/batch/tables',
  method: 'get',
  params
}, false)
// 订单详情去绑定
export const createAndBind = data => fetch({
  url: '/api/user/batchUser/createAndBind',
  method: 'post',
  data
})
// 获取所有量表--
export const getAllTable = () => fetch({
  url: '/api/table/all',
  method: 'get'
})
// 获取测试需要完成的量表信息
export const userBatchInfo = (params) => fetch({
  url: '/api/user/batch/info',
  method: 'get',
  params
})
