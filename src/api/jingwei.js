import fetch from './http.js'

// 课程购买
export const orderCourse = data => fetch({
  url: '/api/cbtCourse/orderCourse',
  method: 'post',
  data
})

// 用户ICBT课程列表
export const userICbtList = () => fetch({
  url: '/api/cbtCourse/userICbtList',
  method: 'get'
})

// 用户ICBT课程的 课次列表
export const userICbtLessonList = recordId => fetch({
  url: '/api/cbtCourse/userICbtLessonList',
  method: 'get',
  params: { recordId }
})

// 做课程接口
export const cbtQuestion = data => fetch({
  url: '/api/cbtCourse/cbtQuestion',
  method: 'post',
  data
})
