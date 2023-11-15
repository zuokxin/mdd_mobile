<template>
  <div>
    <van-nav-bar title="报告" left-arrow @click-left="onClickLeft" @click-right="onClickRight" fixed>
      <template #right v-if="tableType == 2">
        <van-icon name="replay" size="18" />
        <span>刷新</span>
      </template>
    </van-nav-bar>
    <iframe :src="src" frameborder="0"></iframe>
    <div v-if="followShow" class="follow-card">
      <div class="left">
        扫码关注“<span><img src="https://fubian-yunyu.oss-cn-shanghai.aliyuncs.com/复变LOGO.png" alt="logo"
            width="14"></span>复变云愈”微信公众号历史测试结果查询 | CBT疏导情绪心理漫画 | 精选专题内容测评更多丰富量表，让你充分认知自己
      </div>
      <div class="right">
        <img src="https://fubian-yunyu.oss-cn-shanghai.aliyuncs.com/customer-service/yunyuQRCode.png" alt="yunyuQRCode">
      </div>
      <van-icon class="icon" name="cross" @click="close" />
    </div>
  </div>
</template>

<script>
import wxShare from '@/utils/wxShare'
import { getReportRes } from '@/api/modules/user'
export default {
  data () {
    return {
      src: '',
      followShow: false
    }
  },
  computed: {
    tableType () {
      return this.$route.query.tableType
    },
    sessionId () {
      return this.$route.query.sessionId
    }
  },
  mounted () {
    this.src = window.location.origin + '/user#/result?sessionId=' + this.sessionId
    getReportRes({ sessionId: this.sessionId }, false).then(
      ({ data = {} }) => {
        // 清赟显示卡片
        if (data.orgMarking === 'qingyun') {
          // 看过
          if (localStorage.qingyun && localStorage.qingyun.includes(this.sessionId)) return
          this.followShow = true
          localStorage.qingyun = localStorage.qingyun ? localStorage.qingyun + '-' + this.sessionId : this.sessionId
        }
      }
    )
    // this.src = 'https://depression.local.fubianmed.com/user#/result?sessionId=' + this.$route.query.sessionId
    wxShare.hiddenShare()
  },
  methods: {
    onClickLeft () {
      const backPath = sessionStorage.getItem('backPath')
      if (backPath === 'bind') {
        sessionStorage.removeItem('backPath')
        this.$router.replace('/my-bind')
      } else {
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
      }
    },
    onClickRight () {
      window.location.reload()
    },
    close () {
      this.followShow = false
    }
  }
}
</script>

<style lang="less" scoped>
iframe {
  width: 100%;
  height: calc(100 * var(--vh) - 1.226667rem);
  padding-top: 1.126667rem;
}

.follow-card {
  position: fixed;
  left: 0;
  bottom: 0;
  // width: 100%;
  display: flex;
  align-items: center;
  padding: 14px 35px 14px 26px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px 10px 0 0;

  .left {
    margin-right: 40px;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 1.75;
    flex: 1;

    img {
      vertical-align: text-top;
    }
  }

  .right {
    width: 49px;

    img {
      width: 100%;
    }
  }

  .icon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    color: #fff;
  }
}
</style>
