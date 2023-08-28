<template>
  <div class="detail">
    <img
      v-if="courseId && !(courseId === '0' || courseId === '1')"
      class="detail-banner"
      :src="course.headImage || require('@/assets/img/detail-bannner.png')"
    />
    <!-- 头部盒子 -->
    <detail-header
      v-if="courseId && !(courseId === '0' || courseId === '1')"
      :name="course.courseName"
      :price="String(course.price)"
      :time="String(course.time)"
      :evalRecordCount="course.cnt"
    ></detail-header>
    <!-- 详情描述 -->
    <detail-content :detailPageImages="course.detailPageImages"></detail-content>
    <!-- 足部操作区 -->
    <div class="van-goods-action">
      <div class="van-goods-action-icon more-cbt" @click="$router.push('/cbt-more')">更多疏导</div>
      <van-button
        v-if="!weixinBtn"
        class="to-cbt"
        round
        type="primary"
        block
        :disabled="canGo"
        @click="onClickButton"
      >去App疏导吧</van-button>
      <!-- 微信内按钮 -->
      <wx-open-launch-app
        v-else
        id="launch-btn"
        class="launch-btn"
        appid="wx4d94fab8d9952d73"
        :extinfo="extinfo"
      >
        <script type="text/wxtag-template">
          <style>
            .wx-cbt-btn {
              position: relative;
              display: inline-block;
              box-sizing: border-box;
              width: 100%;
              height: 40px;
              padding: 0 15px;
              font-size: 16rem / @w;
              line-height: 40px;
              text-align: center;
              border-radius: 20px;
              cursor: pointer;
              transition: opacity 0.2s;
              -webkit-appearance: none;
              color: #fff;
              background-color: #34B7B9;
              border: 1px solid #34B7B9;
            }
          </style>
          <div class="wx-cbt-btn">去App疏导吧</div>
        </script>
      </wx-open-launch-app>
    </div>
  </div>
</template>

<script>
import DetailHeader from './detail-header.vue'
import DetailContent from './detail-content.vue'
import { Dialog } from 'vant'
import { getCbtCourseInfo, wxSignatures } from '@/api/index'
import wxShare from '@/utils/wxShare'
import browser from '@/utils/browser'
// const params = new URLSearchParams(window.location.search)
export default {
  name: 'cbt-detail',
  components: {
    DetailHeader,
    DetailContent
  },
  data () {
    return {
      canGo: true,
      // cbt详情
      course: {
        courseName: '--',
        price: 0,
        courseImage: '',
        headImage: '',
        detailImageUrl: '',
        detailPageImages: [],
        time: 0,
        cnt: 0
      },
      courseId: '',
      ios: browser().ios,
      weixin: browser().weixin,
      android: browser().android,
      extinfo: '{}',
      path: '',
      weixinReady: false
    }
  },
  computed: {
    weixinBtn () {
      return this.weixin && this.weixinReady
    }
  },
  created () {
    this.courseId = this.$route.query.courseId
    // 云愈CBT体验课和云愈CBT自动思维课程显示名字，其余叫课程详情
    if (this.courseId === '0') {
      document.title = '云愈CBT体验课'
      this.path = 'CBTTrialIntro'
    } else if (this.courseId === '1') {
      document.title = '云愈CBT自动思维课程'
      this.path = 'CBTATIntro'
    } else {
      this.path = 'ThemeCourse_' + this.courseId
    }
  },
  async mounted () {
    // cbt信息
    getCbtCourseInfo(this.courseId).then(
      res => {
        this.canGo = false
        this.course = Object.assign(this.course, res.data)
        // 系统课结构处理
        if (this.course.courseId === '0' || this.course.courseId === '1') {
          this.course.detailPageImages = [{
            name: '课程详情',
            url: this.course.detailImageUrl
          }]
        }
        this.share()
      }
    )
  },
  methods: {
    onClickButton () {
      // 未登录
      console.log('onClickButton')
      const params = this.path
      console.log(params, 'app')
      // ios
      if (this.ios) {
        window.location.href = 'fubian://' + params
        window.setTimeout(() => {
          window.location.href = 'https://apps.apple.com/cn/app/id1540713920'
        }, 3000)
      }
      // 安卓
      if (this.android) {
        window.location.href = 'app://fubianmed.com/welcome?path=' + params
        window.setTimeout(() => {
          window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.fubian.depressiondetection'
        }, 3000)
      }
    },
    // 弹窗封装
    thisDialog (message, btnText = '确定', type = 'alert') {
      if (type === 'alert') {
        return Dialog.alert({
          message,
          theme: 'round-button',
          className: 'detail-dialog',
          confirmButtonText: btnText,
          confirmButtonColor: '#34B7B9'
        })
      } else if (type === 'confirm') {
        return Dialog.confirm({
          message,
          theme: 'round-button',
          className: 'detail-dialog-confirm',
          confirmButtonText: btnText,
          confirmButtonColor: '#fff',
          cancelButtonText: '未支付',
          cancelButtonColor: '#34B7B9'
        })
      }
    },
    // 微信分享详情页
    share () {
      const currentUrl = window.location.href
      const dataForm = {
        title: this.course.courseName,
        desc: '我在云愈心理发现一份不错的课程，你也来测测看～',
        link: currentUrl,
        imgUrl: this.course.courseImage
      }
      wxSignatures({ url: currentUrl }).then(res => {
        this.extinfo = JSON.stringify({ path: this.path })
        wxShare.getJSSDK(res.data, dataForm, (e) => {
          if (e.type === 'ready' && e.code === 200) {
            this.weixinReady = true
            console.log('ready')
            this.$nextTick(() => {
              const vm = this
              const btn = document.getElementById('launch-btn')
              btn.addEventListener('launch', function () {
                console.log('success')
              })
              btn.addEventListener('error', function (e) {
                vm.onClickButton()
                console.log(e.detail)
              })
            })
          }
        })
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  }
}
</script>
<style lang="less">
.detail-dialog-confirm {
  .van-dialog__message {
    font-size: 0.4266667rem;
    font-weight: 700;
    color: #000000;
  }
  .van-dialog__confirm {
    color: #34b7b9 !important;
    border-radius: 999px;
    border:1px solid #34b7b9 !important;
  }
  .van-dialog__cancel {
    border-radius: 999px;
    margin-right: 20px;
  }
  .van-dialog__footer {
    padding: 8px 50px 40px;
  }
}
</style>
<style lang="less" scoped>
@w: 37.5;
.detail-banner {
  width: 100%;
  position: relative;
  z-index: 0;
}
.detail {
  background: #F6F6F7;
  .van-goods-action {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.06);
  }
  .van-goods-action-icon {
    padding-left: 20rem / @w;
    padding-right: 20rem / @w;
    font-size: 14rem / @w;
    color: #333333;
  }
  /deep/.van-button__content {
    font-size: 16rem / @w;
    color: #FFFFFF;
  }
  .more-cbt {
    min-width: 90rem / @w;
    text-align: center;
    padding: 0;
  }
  .to-cbt {
    margin-left: 10px;
    margin-right: 10px;
    height: 40px;
  }
}
.launch-btn {
  width: 100%;
  padding: 0 10px;
}
</style>
