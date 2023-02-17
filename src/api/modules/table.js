import fetch from '../http.js'

// 量表点赞
export const postTableKudos = (tableCode) => fetch({
  url: '/api/user/table/kudos',
  method: 'post',
  data: { tableCode }
})

// 量表优惠信息
export const getTableDiscount = (tableCode, discountCode) => fetch({
  url: '/api/user/table/discountPrice',
  method: 'get',
  params: { tableCode, discountCode }
}, false)

// 量表收藏
export const postTablecoll = data => fetch({
  url: '/api/user/table/collection',
  method: 'post',
  data
})
// 量表模糊搜索
export const searchTable = params => fetch({
  url: '/api/user/fuzzy/search/table',
  method: 'get',
  params
})

// 量表推荐位
export const recommendSeat = () => fetch({
  url: '/api/app/recommend/seat',
  method: 'get'
})
