// 查找未完成的量表下标
export function findIndexByKeyValue (arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return i
    }
  }
  return -1
}
