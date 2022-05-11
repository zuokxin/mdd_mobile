<template>
  <div class="container" ref="container">
    <div class="img"><img src="@/assets/login.png" alt="yunyu"></div>
    <h5>登录/注册</h5>
    <van-field v-model="username" type="number" placeholder="请输入手机号码（新手机号自动注册）" @blur="checkUsername" />
    <van-field class="line" v-model="smsCode" type="number" maxlength="6"  placeholder="请输入验证码">
      <template #button>
        <van-button class="timeBtn" size="small"  @click="getMsgCode" round type="primary" :disabled="msgFlag || timeFlag">{{getmsg}}</van-button>
      </template>
    </van-field>
    <div class="login">
      <van-button round block type="primary" @click="login" :disabled="allCompleteFlag">登录</van-button>
    </div>
    <p>登录注册即代表同意 <span @click="skip('agreements')">《服务协议》</span > 及 <span @click="skip('policy')">《隐私政策》</span> </p>
  </div>
</template>

<script>
import { getCode, postUserLogin } from '@/api/modules/login'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      smsCode: '',
      timeFlag: false,
      getmsg: '获取验证码'
    }
  },
  mounted () {
    this.$refs.container.style.height = window.innerHeight + 'px'
    // const flag = this.$store.getters.isLogin(sessionStorage.getItem('phone'))
    // console.log(this.$route)
  },
  computed: {
    msgFlag () {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (this.username !== '' && reg.test(this.username)) {
        return false
      } else {
        return true
      }
    },
    allCompleteFlag () {
      if (!this.msgFlag && this.smsCode !== '') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 检查名字
    checkUsername () {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (this.username === '') {
        this.$toast('请输入手机号')
      } else if (!reg.test(this.username)) {
        this.$toast('请输入正确的手机号')
      }
    },
    // 获取验证码
    async getMsgCode () {
      const { code } = await getCode(this.username)
      if (code === 0) {
        this.timeFlag = true
        this.countDown(60)
      }
    },
    // 计时器
    countDown (time) {
      if (time === 0) {
        this.getmsg = '重新获取'
        this.timeFlag = false
        return
      } else {
        this.getmsg = time + 's'
        time--
      }
      setTimeout(() => { this.countDown(time) }, 1000)
    },
    // 登录
    login () {
      const data = {
        username: this.username,
        smsCode: this.smsCode
      }
      postUserLogin(data).then(res => {
        if (this.$route.query.url) {
          this.$router.push({ path: this.$route.query.url, query: this.$route.query })
        } else {
          this.$router.push({ path: '/test-more' })
        }
        sessionStorage.phone = res.data.phone
        res.data.openid && (sessionStorage.openid = res.data.openid) // 微信内授权状态
      }).catch(err => {
        this.$toast(err.message)
      })
    },
    // 链接
    skip (type) {
      if (type === 'policy') {
        window.location.href = 'https://depression.fubianmed.com/agreements/#/privacy'
      } else {
        window.location.href = 'https://depression.fubianmed.com/agreements/#/user'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/reset-vant.less';
.container{
  padding-left: 1.28rem;
  position: absolute;
  width: 100%;
  padding-right: 1.28rem;
  padding-top: 1.6rem;
  box-sizing: border-box;
  background: #FFFFFF;
  height: 100%;
  overflow: hidden;
  .img{
    text-align: center;
    img{
      width: 2.133333rem;
      height: 1.626667rem;
      margin: 0 auto;
    }
    margin-bottom: 1.093333rem;
  }
  h5{
    font-size: .533333rem;
    font-weight: 600;
    color: #000000;
    height: .746667rem;
    line-height: .746667rem;
    margin-bottom: 1.066667rem;
  }
  .login{
    margin-top: 1.066667rem;
  }
  .timeBtn{
    width: 2.133333rem;
    padding: 0;
  }
  .van-button{
    background-color: @green;
    border: 1px solid @green;
  }
  .van-button--disabled{
    background-color: @gray-5;
    border: 1px solid @gray-5;
  }
  .van-cell{
    padding-left: 0;
    height: 1.573333rem;
    padding-top: .4rem;
    padding-right: 0;
    border-bottom: 1px solid #DEDEDE;
  }
  .van-cell::after{
    display: none;
  }
  p{
    position: absolute;
    bottom: 20px;
    left: 50%;
    font-size: .32rem;
    text-align: center;
    width: 100%;
    transform: translateX(-50%);
    word-break: keep-all;
    span{
      color: @green;
    }
  }
}
</style>
