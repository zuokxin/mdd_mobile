import fetch from '../http.js'

// 更新做表前用户信息
export const userCreate = data => fetch({
  url: '/api/user/table/info',
  method: 'post',
  data
})
// 获取做表前用户信息
export const getUserCreate = params => fetch({
  url: '/api/user/table/info',
  method: 'get',
  params
})

// 获取所有表的相关信息
export const getAllTable = () => fetch({
  url: '/api/table/all',
  method: 'get'
})

// 获取用户信息
export const getUserInfo = () => fetch({
  url: '/api/user/me',
  method: 'get'
})
// 更新用户信息
export const updateInfo = data => fetch({
  url: '/api/user/update',
  method: 'post',
  data
})

/*****************************
 *     用户测试相关配置
 *****************************/

// 获取最新未完成的批次
export const getUserBatch = () => fetch({
  url: '/api/user/batch/tables',
  method: 'get'
}, false)

// 提交用户选择的量表
export const postUserTables = (data) => fetch({
  url: '/api/user/batch/tables',
  method: 'post',
  data
})

/*****************************
 *           做题
 *****************************/

// 获取测试结果
export const getReportRes = (params, errMessage = true) => fetch({
  url: '/api/user/batch/report',
  method: 'get',
  params
}, errMessage)

// 获取单题题目
export const getTableQues = (params) => fetch({
  url: '/api/user/table/question',
  method: 'get',
  params
})
// 提交单题题目
export const postTableQues = (data) => fetch({
  url: '/api/user/table/question',
  method: 'post',
  data
})

// 提交单题信息
export const posTableQues = (data) => fetch({
  url: `/api/user/table/question?sessionId=${data.sessionId}`,
  method: 'post',
  data
}, false)

// 完成指定量表
export const postTableRes = data => fetch({
  url: '/api/user/table/finish',
  method: 'post',
  data
})

// 提交信息
// export const postTestRes = data => fetch({
//   url: '/api/answer',
//   method: 'post',
//   data
// })

// 获取用户历史批次列表
export const getHistory = (params) => fetch({
  url: '/api/user/history/organization',
  method: 'get',
  params
})

// 医院内部系统获取历史记录&艾滋海默
export const recordList = (params) => fetch({
  url: '/api/batch/users/list',
  method: 'get',
  params
})

// 医院内部系统获取结果(自评量表)
export const getResult = (id) => fetch({
  url: `/api/user/batch/report?sessionId=${id}`,
  method: 'get'
})

// 更改报告状态
export const changeReportStatus = data => fetch({
  url: '/api/batch/user/update',
  method: 'post',
  data
})

// 全部量表分类
export const tableTypeList = (params) => fetch({
  url: '/api/table/selfTableType/retrieveType',
  method: 'get',
  params
})

// 获取用户信息
export const getIndividual = (params) => fetch({
  url: '/api/user/history/individual',
  method: 'get',
  params
})

// 获取用户信息
export const getCollect = (params) => fetch({
  url: '/api/user/table/collection',
  method: 'get',
  params
})
