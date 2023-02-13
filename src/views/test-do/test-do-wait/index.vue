<template>
  <div class="container">
    <div class="img-box">
      <img src="@/assets/trans.png">
      <div class="text">{{num}} <span>秒</span> </div>
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
      num: 60,
      timer: null
    }
  },
  computed: {
    sessionId () {
      return this.$route.query.sessionId
    },
    configTables () {
      return sessionStorage.tables ? JSON.parse(sessionStorage.tables) : []
    },
    second () {
      if (this.configTables.length !== 0) {
        const flag = this.configTables.some(v => {
          return v.table.tableType === 2
        })
        // console.log('flag:' + flag)
        return flag
      } else {
        return !(this.$route.query.s === '5')
      }
    }
  },
  mounted () {
    let getWait = 0
    // console.log(this.second, this.configTables)
    if (this.$store.getters.isLogin(sessionStorage.getItem('phone'))) {
      if (!this.second) this.num = 5
      this.timer = setInterval(async () => {
        if (this.num > 0) {
          if (this.second) {
            if (getWait === 5) {
              getReportRes({ sessionId: this.sessionId }, false).then(
                ({ data }) => {
                  if (data.reportAllCompleted) {
                    this.finish()
                  } else {
                    getWait = 0
                  }
                }
              ).catch(
                err => {
                  console.log(err)
                  getWait = 0
                }
              )
            } else {
              getWait++
            }
          }
          this.num--
        } else {
          this.finish()
        }
      }, 1000)
    } else {
      this.$router.replace('/login')
    }
    wxShare.hiddenShare()
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (sessionStorage.tables) {
      sessionStorage.removeItem('tables')
    }
  },
  methods: {
    finish () {
      clearInterval(this.timer)
      if (sessionStorage.reportDisplayEnabled === 'false') {
        const mark = sessionStorage.getItem('setMark')
        if (mark === 'gerenpay') {
          sessionStorage.removeItem('setMark')
          this.$router.replace('/my-record?type=1')
        } else if (mark === 'jigoupay') {
          sessionStorage.removeItem('setMark')
          this.$router.replace('/my-record?type=2')
        } else {
          this.$router.go(-1)
        }
        return
      }
      this.$router.replace({
        path: '/test-report',
        query: {
          sessionId: this.sessionId,
          tableType: this.second ? 2 : 1
        }
      })
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
    // border: 1px solid #34b7b9;
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
