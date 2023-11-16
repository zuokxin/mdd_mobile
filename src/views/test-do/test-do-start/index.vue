<template>
  <div class="test">
    <div class="test-wrap">
      <p>1、您将要完成{{ tableInfo.num }}个测试，预估耗时{{ tableInfo.time }}分钟；</p>
      <p>2、如购买了AI心理测评，在问诊过程中会调用您的摄像头/语音设备,请确保环境噪音不高于40分贝，建议在私密环境下进行；</p>
      <p>3、在答题过程中，请保持人脸稳定持续在图相框内，否则需要重新答题；</p>
      <p>4、在答题过程中，请确保符合您当下的真实情况，否则可能会影响测试结果；</p>
      <p>5、测试中途退出，再次进入可重新答题.</p>
      <div v-if="tableCode === 'FADI'" class="fadi-select">
        <div class="title">请您选择小愈虚拟形象后开始答题</div>
        <van-row type="flex" justify="center" gutter="20">
          <van-col span="11">
            <van-image :class="{ 'select': gender === 'woman' }" fit="contain" :src="img1"
              @click="selectGender('woman')" />
          </van-col>
          <van-col span="11">
            <van-image :class="{ 'select': gender === 'man' }" fit="contain" :src="img2" @click="selectGender('man')" />
          </van-col>
        </van-row>
      </div>
    </div>
    <van-button round type="primary" @click="go"
      style="display: block; width: 80%; margin: 20px auto 0;">开始答题</van-button>
  </div>
</template>

<script>
// @ is an alias to /src
import wxShare from '@/utils/wxShare'
export default {
  name: 'test-do-start',
  data () {
    return {
      img1: require('@/assets/img/fadi-famale.png'),
      img2: require('@/assets/img/fadi-male.png'),
      gender: 'woman',
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
      sessionStorage.fadiGender = this.gender
      // 1 自评
      if (this.$route.query.tableType === '1') {
        this.$router.replace({ path: '/test-do-self', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
      }
      // 2 他评
      if (this.$route.query.tableType === '2') {
        this.$router.replace({ path: '/environment', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
      }
    },
    // 选择性别
    selectGender (gender) {
      if (this.gender === gender) return
      this.gender = gender
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;

.test {
  min-height: calc(100 * var(--vh));
  background-color: #F6F6F6;
  padding: 16px 20px;
  font-size: 14rem / @w;
  font-weight: 400;
  color: #333333;
  box-sizing: border-box;

  p {
    margin-top: 0;
    margin-bottom: 10rem / @w;
    line-height: 1.5;
  }

  .test-wrap {
    background-color: #fff;
    height: calc(100 * var(--vh) - 3rem);
    border-radius: 10px;
    padding: 16px 12px;
    box-sizing: border-box;
  }

  .fadi-select {
    .title {
      margin-top: 50rem / @w;
      margin-bottom: 16rem / @w;
      font-size: 16rem / @w;
      font-weight: 400;
      text-align: center;
      color: #333333;
    }

    .van-image {
      border: 1px solid #666;
    }

    .select {
      border: 2px solid #34B7B9;
    }
  }
}
</style>
