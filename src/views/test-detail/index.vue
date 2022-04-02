<template>
  <div class="detail">
    <img class="detail-banner" src="@/assets/img/detail-bannner.png"/>
    <detail-header :tableName="table.tableName" :discountAmountInfo="discountAmountInfo" :price="String(table.price)"></detail-header>
    <div class="detail-wrap">
      <detail-box title="适用人群">
        <p>{{ table.applicablePeople }}</p>
      </detail-box>
      <detail-box title="评估方向">
        <p>{{ table.evaluationDirection }}</p>
      </detail-box>
      <detail-box title="介绍">
        <div v-html="table.detail"></div>
      </detail-box>
      <detail-box title="温馨提示">
        <p v-for="(tip, index) in table.tips" :key="tip">
          <span v-if="table.tips.length > 1">{{ index+1 }}.</span>
          <span>{{ tip }}</span>
        </p>
      </detail-box>
      <detail-box title="预估耗时">
        <p>*本测试预估耗时{{ time }}分钟</p>
      </detail-box>
    </div>
    <pay-action :payInfo="payInfo" :visible.sync="showPay" @finishPay="finishPay"></pay-action>
    <van-goods-action :safe-area-inset-bottom="true">
      <van-goods-action-icon to="/test-more" text="更多测评"/>
      <van-goods-action-button
        v-if="!go"
        type="primary"
        :text="btnInfo"
        @click="onClickButton"
      />
      <van-goods-action-button
        v-else
        type="primary"
        :text="btnGoInfo"
        @click="$router.push(`/test-do-infos?sessionId=${sessionId}&tableCode=${tableCode}`)"
      />
    </van-goods-action>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import DetailHeader from './detail-header.vue'
import DetailBox from './detail-box.vue'
import PayAction from './pay-action.vue'
import { tableInfo, postUserCode, getOrderState } from '@/api/index'
import browser from '@/utils/browser'
const params = new URLSearchParams(window.location.search)
export default {
  name: 'test-detail',
  components: {
    DetailHeader,
    DetailBox,
    PayAction
  },
  data () {
    return {
      // 量表详情
      table: {
        tableName: '--',
        price: 0,
        detail: '--',
        minTimeMinute: 0,
        maxTimeMinute: 0,
        applicablePeople: '--',
        evaluationDirection: '--',
        tips: []
      },
      discountAmount: 0,
      showPay: false, // 付款弹窗
      code: '',
      go: false, // 是否去测试
      sessionId: '', // 当前测试的sessionid
      continue: false, // 是否为继续测试
      tableCode: ''
    }
  },
  computed: {
    // 支付框所需信息
    payInfo () {
      const { price, tableName } = this.table
      return {
        price,
        tableName,
        discountAmount: this.discountAmountInfo,
        tables: [this.tableCode]
      }
    },
    // 耗时须知文本
    time () {
      const min = this.table.minTimeMinute || 0
      const max = this.table.maxTimeMinute || 0
      return min === max ? min : `${min}~${max}`
    },
    // 折扣
    discountAmountInfo () {
      const res = this.discountAmount || this.table.price
      return String(res)
    },
    // 支付按钮文案
    btnInfo () {
      return `￥${this.discountAmountInfo} 立即测试`
    },
    // 去测试按钮文案
    btnGoInfo () {
      return this.continue ? '继续测试' : '开始测试'
    }
  },
  async mounted () {
    // 继续测试
    // this.continue = this.$route.query.continue
    // if (this.continue) this.go = true
    // 量表信息
    this.tableCode = this.$route.query.tableCode
    tableInfo(this.tableCode).then(
      res => {
        this.table = res.data
      }
    )
    this.$nextTick(async () => {
      // 微信授权
      this.code = params.get('code') || ''
      if (!sessionStorage.openid && this.code) {
        await postUserCode(this.code).then(res => {
          sessionStorage.openid = res.data.openid
        })
      }
      // h5支付页面回调处理
      const redirect = this.$route.query.redirect
      const orderid = this.$route.query.orderid
      if (redirect === 'h5pay' && orderid) {
        this.finishPay(orderid)
      }
    })
  },
  methods: {
    consoleReture () {
      console.log(this.test())
    },
    onClickButton () {
      // 未登录
      if (!sessionStorage.phone) {
        this.$router.push({
          path: '/login',
          query: {
            url: this.$route.path,
            tableCode: this.$route.query.tableCode
          }
        })
        return
      }
      // 微信内未授权
      if (browser().weixin && !sessionStorage.openid) {
        const appid = 'wxb073a9d513bbcd43'
        const redirect = encodeURIComponent(window.location.href)
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
      } else {
        this.showPay = true
      }
    },
    // 支付回调刷新
    refresh (state = 0) {
      const redirect = this.$route.query.redirect
      // h5支付回调
      if (redirect === 'h5pay') {
        // 支付失败后退回支付初始页
        if (!state) {
          this.$router.go(-2)
        } else {
          const path = `${this.$route.path}?tableCode=${this.$route.query.tableCode}`
          this.$router.replace(path)
        }
      } else {
        // 其他支付，成功后关闭支付弹窗
        if (state) {
          this.showPay = false
        }
      }
    },
    // 弹窗封装
    thisDialog (message, btnText = '确定') {
      return Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: btnText,
        confirmButtonColor: '#34B7B9'
      })
    },
    // 完成支付
    finishPay (orderId, num = 0) {
      getOrderState(orderId).then(
        res => {
          if (res.data.orderStatus === 'success') {
            this.thisDialog('支付成功').then(() => {
              this.go = true
              this.sessionId = res.data.sessionId
              this.refresh(1)
            })
          } else if (res.data.orderStatus === 'fail') {
            this.thisDialog('支付失败').then(() => {
              this.refresh()
            })
          } else if (res.data.orderStatus === 'waitpay') {
            if (num < 5) {
              this.thisDialog('未获取到支付结果，请刷新重试', '刷新').then(() => {
                this.finishPay(orderId, num + 1)
              })
            } else {
              this.thisDialog('未获取到支付结果，请联系客服0512-6856-5993', '返回').then(() => {
                this.refresh()
              })
            }
          }
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
@w: 37.5;
.detail-banner {
  width: 100%;
  position: relative;
  z-index: 0;
}
.detail {
  background: #F6F6F7;
  .van-goods-action-icon {
    padding-left: 20rem / @w;
    padding-right: 20rem / @w;
    font-size: 14rem / @w;
    font-weight: 700;
    color: #333333;
  }
  /deep/.van-button__content {
    font-size: 16rem / @w;
    font-weight: 700;
    color: #FFFFFF;
  }
}
.detail-wrap {
  padding-top: 25rem / @w;
  padding-left: 20rem / @w;
  padding-right: 20rem / @w;
  padding-bottom: 100rem / @w;
  background: #fff;
}
</style>
