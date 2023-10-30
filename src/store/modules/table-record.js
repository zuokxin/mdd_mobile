/* eslint-disable */
import { batchInfo } from '@/api/modules/user'
import router from '@/router'
export default {
  state: {
    records: [],
    next: false
  },
  getters: {
  },
  mutations: {
    SET_RECORDS(state, records) {
      state.records = records
    },
    SET_NEXT (state, next) {
      state.next = next
    }
  },
  actions: {
    getCurTestRecord (context, data = {}) {
      return new Promise((resolve, reject) => {
        const sessionId = router.currentRoute.query.sessionId || data.sessionId
        batchInfo({ sessionId }).then(res => {
          const next = nextTable(
            data.tableCode,
            res.data.evalRecords
          )
          console.log(next, '123', sessionId)
          context.commit('SET_NEXT', next)
          resolve({
            records: res.data.evalRecords,
            next
          })
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

// 查询下一个量表
function nextTable (tableCode, records) {
  const residueTables = records.filter(
    v => v.tableCode !== tableCode && !v.finishedAt
  )
  if (residueTables.length > 0) {
    return residueTables[0]
  }
  console.log(tableCode, records, residueTables)
  return false
}
