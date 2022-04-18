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
})

// 量表收藏
export const postTablecoll = data => fetch({
  url: '/api/user/table/collection',
  method: 'post',
  data
})
