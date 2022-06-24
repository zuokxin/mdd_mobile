export default {
  state: {
    tables: []
  },
  getters: {
    curTables () {
      return sessionStorage.tables ? JSON.parse(sessionStorage.tables) : []
    },
    nextTable () {
      const { curTables } = arguments[1]
      return curTableCode => {
        const index = curTables.findIndex(v => {
          return v.tableCode === curTableCode
        })
        // console.log(index, curTables, curTableCode)
        console.log(index, curTableCode)
        if (index !== -1 && index + 1 !== curTables.length) return curTables[index + 1]
        return false
      }
    }
  },
  mutations: {
    SET_TABLES_TITLE (state, tables) {
      sessionStorage.tables = JSON.stringify(tables)
      state.tables = tables
    }
  },
  actions: {
  }
}
