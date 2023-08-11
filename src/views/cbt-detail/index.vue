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
    <van-goods-action :safe-area-inset-bottom="true">
      <van-goods-action-icon to="/cbt-more" text="更多疏导"/>
      <van-goods-action-button
        type="primary"
        text="去App疏导"
        :disabled="canGo"
        @click="onClickButton"
      />
    </van-goods-action>
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
      android: browser().android
    }
  },
  created () {
    this.courseId = this.$route.query.courseId
    // 云愈CBT体验课和云愈CBT自动思维课程显示名字，其余叫课程详情
    if (this.courseId === '0') document.title = '云愈CBT体验课'
    if (this.courseId === '1') document.title = '云愈CBT自动思维课程'
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
      let params = ''
      if (this.courseId === '0') {
        // 系统体验课
        params = 'CBTTrialIntro'
      } else if (this.courseId === '1') {
        // 系统思维课
        params = 'CBTATIntro'
      } else {
        params = 'ThemeCourse_' + this.courseId
      }
      // ios
      if (this.ios) {
        window.location.href = 'fubian://fubianmed.com/welcome?path=' + params
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
        if (res.code === 0) {
          wxShare.getJSSDK(res.data, dataForm)
        }
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
    font-weight: 700;
    color: #FFFFFF;
  }
}
</style>
