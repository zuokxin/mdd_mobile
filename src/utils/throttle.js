/**
* 防抖
* @param {Function} fn
* @param {Number} delay
*/
export function throttle (fn, delay) {
  let valid = true
  return function (...arg) {
    if (!valid) {
      return false
    }
    valid = false
    setTimeout(() => {
      fn.apply(this, arg)
      valid = true
    }, delay)
  }
}

/**
* 节流
* @param {Function} fn
* @param {Number} delay
*/
export function debounce (fn, delay) {
  let timer
  return function (...arg) {
    if (timer) clearTimeout(timer)
    const result = fn.apply(this, arg)
    timer = setTimeout(result, delay)
  }
}
