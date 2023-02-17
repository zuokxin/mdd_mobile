<template>
  <div class="test">
    <div class="test-wrap">
      <p>1、您将要完成{{ tableInfo.num }}个测试，预估耗时{{ tableInfo.time }}分钟；</p>
      <p>2、在答题过程中，请确保符合您当下的真实情况，否则可能会影响测试结果；</p>
      <p>3、测试中途退出，再次进入可重新答题；</p>
      <p>4、若您购买了“AI心理测评”类别中的任一测试，在答题时会调用您的摄像头及语音设备。为保证结果准确，建议在私密环境下开始答题。</p>
    </div>
    <van-button round type="primary" @click="go" style="display: block; width: 80%; margin: 20px auto 0;">开始答题</van-button>
  </div>
</template>

<script>
// @ is an alias to /src
import wxShare from '@/utils/wxShare'
export default {
  name: 'test-do-start',
  data () {
    return {
      sessionId: '',
      tableCode: '',
      tableInfo: {
        num: 0,
        time: ''
      }
    }
  },
  mounted () {
    this.sessionId = this.$route.query.sessionId
    this.tableCode = this.$route.query.tableCode
    const tables = sessionStorage.getItem('tables')
    if (tables) {
      const tablbsFormat = JSON.parse(tables)
      // 统计测试数量
      this.tableInfo.num = tablbsFormat.length
      // 处理时间显示
      this.tableInfo.time = (() => {
        let min = 0
        let max = 0
        tablbsFormat.forEach(v => {
          const table = v.table || {}
          min += table.minTimeMinute || 0
          max += table.maxTimeMinute || 0
        })
        return min === max ? max + '' : `${min}~${max}`
      })()
    }
    wxShare.hiddenShare()
  },
  methods: {
    go () {
      // 1 自评
      if (this.$route.query.tableType === '1') {
        this.$router.replace({ path: '/test-do-self', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
      }
      // 2 他评
      if (this.$route.query.tableType === '2') {
        this.$router.replace({ path: '/environment', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.test {
  min-height: 100vh;
  background-color: #F6F6F6;
  padding: 16px 20px;
  font-size: 14rem / @w;
  font-weight: 400;
  color: #333333;
  p {
    margin-top: 0;
    margin-bottom: 10rem / @w;
    line-height: 1.5;
  }
  .test-wrap {
    background-color: #fff;
    min-height: 80vh;
    border-radius: 10px;
    padding: 16px 12px;
  }
}
</style>
