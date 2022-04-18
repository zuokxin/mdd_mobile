<template>
  <div class="container">
    <div class="img-box">
      <img src="@/assets/trans.png">
      <div class="text">{{s}} <span>秒</span> </div>
    </div>
    <p>测试结束，请等待生成结果</p>
  </div>
</template>

<script>
import { getReportRes } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'
export default {
  name: 'test-wait',
  data () {
    return {
      sessionId: '',
      s: 5,
      interval: null
    }
  },
  mounted () {
    this.sessionId = this.$route.query.sessionId
    if (this.$store.getters.isLogin(sessionStorage.getItem('phone'))) {
      this.interval = setInterval(() => {
        this.init()
        this.s -= 1
      }, 1000)
    } else {
      this.$router.replace('/login')
    }
    wxShare.hiddenShare()
  },
  methods: {
    async init () {
      const res = await getReportRes({ sessionId: this.sessionId })
      if (res.code === 0) {
        if (res.data.reportAllCompleted || this.s === 0) {
          clearInterval(this.interval)
          // window.location.href = window.location.origin + '/user#/result?sessionId=' + this.sessionId
          this.$router.replace({ path: '/test-report', query: { sessionId: this.sessionId } })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  background: #FFFFFF;
  min-height: 100vh;
  max-height: 100vh;
  .img-box{
    position: relative;
    width: 6.053333rem;
    height: 6.053333rem;
    margin: 3.2rem 1.973333rem 2.133333rem;
    border-radius: 50%;
    border: 1px solid #34b7b9;
    img{
      width: 100%;
      height: 100%;
      animation:changeright 3s linear infinite;
    }
    .text{
      z-index: 999;
      position: absolute;
      color: #34b7b9;
      font-size: .8rem;
      font-weight: bold;
      span{
        font-size: .4rem;
        color: #BBBBBB;
      }
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  p{
    color: #999999;
    font-size: .32rem;
    text-align: center;
  }
}
@keyframes changeright{
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
</style>
