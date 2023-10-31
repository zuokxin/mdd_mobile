// 测试流程中可用到的公共代码
import { mapActions } from 'vuex'
export const testMiXin = {
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'getCurTestRecord'
    ]),
    // 地址判断
    getFullPath (json = {}) {
      const data = Object.assign({
        sessionId: '',
        next: null,
        skipEnv: false
      }, json)
      let path = ''
      const paramsId = `?sessionId=${data.sessionId}`
      // 无测试
      if (!data.next) {
        path = '/test-do-wait' + paramsId
        if (data.skipEnv) path += '&s=60'
        return path
      }
      const paramCode = `&tableCode=${data.next.tableCode}`
      // 自评
      if (data.next.table.tableType === 1) {
        path = '/test-do-self'
      } else {
        // 第一个他评
        if (!data.skipEnv) {
          path = '/environment'
          return path + paramsId + paramCode
        }
        const templates = {
          FADI: '/test-do-faid',
          FADI2: '/test-do-fadi2'
        }
        if (templates[data.tableCode]) path = templates[data.tableCode]
        else path = '/test-do-other'
      }
      return path + paramsId + paramCode
    },
    // 下一个测试
    // skipEnv：自评传false他评传true
    async goNext (skipEnv = true) {
      const { next } = await this.getCurTestRecord({
        sessionId: this.sessionId,
        tableCode: this.tableCode
      })
      const path = this.getFullPath({
        sessionId: this.sessionId,
        next,
        skipEnv // 只有自评出来去环境
      })
      this.$router.replace(path)
    }
  }
}
