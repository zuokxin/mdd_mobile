/**
 * 时间格式化
 * @author linmiaomiao
 */
const DateFormat = ({ date, type = 'default', format }) => {
  date = new Date(date)
  const masks = {
    default: 'yyyy-MM-dd hh:mm:ss',
    mediumDate: 'yyyy-MM-dd hh:mm',
    shortOnlyDate: 'yy-M-d',
    longOnlyDate: 'yyyy-MM-dd',
    shortTime: 'hh:mm',
    mediumTime: 'hh:mm:ss',
    ptTime: 'yyyy.MM.dd hh:mm:ss',
    seconTime: "mm'ss''"
  }
  let fmt = format || masks[type]
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

export {
  DateFormat
}
