<template>
  <div class="detail">
    <img class="detail-banner" :src="table.pageHeaderImage"/>
    <!-- 头部盒子 -->
    <detail-header
      :tableName="table.tableName"
      :tableCode="tableCode"
      :discountAmountInfo="discountAmountInfo"
      :price="String(table.price)"
      :time="String(time)"
      :questionNumber="table.questionNumber"
      :evalRecordCount="table.evalRecordCount"
      :currentUserIsColl="table.currentUserIsColl"
      :kudosNumber="table.kudosNumber"
      :currentUserIsKudos="table.currentUserIsKudos"
      @collect="collectHandle"
    ></detail-header>
    <!-- 详情描述 -->
    <detail-content :table="table"></detail-content>
    <!-- 支付弹窗 -->
    <pay-action
      :payInfo="payInfo"
      :visible.sync="showPay"
      @finishPay="finishPay"
      @errMessage="errMessage"
    ></pay-action>
    <!-- 足部操作区 -->
    <van-goods-action :safe-area-inset-bottom="true">
      <van-goods-action-icon to="/test-more" text="更多测评"/>
      <van-goods-action-button
        v-if="go === 0"
        type="primary"
        :text="btnInfo"
        @click="payTest"
      />
      <van-goods-action-button
        v-if="go === 1"
        type="primary"
        text="开始测试"
        @click="goTest"
      />
    </van-goods-action>
    <CameraDialog :show.sync="otherTestDialog" @needOpenCamera="needOpenCamera"></CameraDialog>
    <!-- <NewPersonGift :flag="newPersonFlag"/> -->
    <Finish v-if="reportBack" />
  </div>
</template>

<script>
import DetailHeader from './detail-header.vue'
import DetailContent from './detail-content.vue'
import Finish from './finish.vue'
import PayAction from '@/components/PayAction.vue'
import CameraDialog from '@/components/CameraDialog.vue'
// import NewPersonGift from '@/components/newPerson'
import { Dialog } from 'vant'
import { tableInfo, postUserCode, getOrderState } from '@/api/index'
import { postTablecoll, getTableDiscount } from '@/api/modules/table'
import browser from '@/utils/browser'
const params = new URLSearchParams(window.location.search)
export default {
  name: 'test-detail',
  components: {
    DetailHeader,
    DetailContent,
    PayAction,
    CameraDialog,
    // NewPersonGift,
    Finish
  },
  data () {
    return {
      openid: '',
      // 量表详情
      table: {
        pageHeaderImage: '',
        tableName: '--',
        price: 0,
        detail: '--',
        minTimeMinute: 0,
        maxTimeMinute: 0,
        applicablePeople: '--',
        evaluationDirection: '--',
        tips: [],
        reference: '',
        questionNumber: 0,
        evalRecordCount: 0,
        kudosNumber: 0,
        currentUserIsKudos: true,
        currentUserIsColl: false,
        tableLogo: '',
        tableType: 1
      },
      // newPersonFlag: false, // 新人有礼
      discountAmount: 0, // 折扣价格
      showPay: false, // 付款弹窗
      code: '', // 微信code
      go: -1, // 是否去测试,1为true，0为false
      sessionId: '', // 当前测试的sessionid
      tableCode: '',
      otherTestDialog: false,
      aiEvalCamEnabled: false,
      reportBack: false
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
        tables: [this.tableCode],
        aiEvalCamEnabled: this.aiEvalCamEnabled
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
      return `确认支付（¥${this.discountAmountInfo}）`
    }
  },
  async mounted () {
    // 量表信息
    this.tableCode = this.$route.query.tableCode
    // if (this.$store.state.phone) {
    //   this.$store.dispatch('getInfo').then(res => {
    //     if (res.data.isNewUser && !res.data.isRxNUReward) {
    //       this.newPersonFlag = true
    //       // 这是满足新人有礼条件
    //     }
    //   })
    // }
    tableInfo(this.tableCode).then(
      res => {
        this.infoHandle(res.data)
        this.$nextTick(async () => {
          // 微信授权
          this.code = params.get('code') || ''
          // 授权第一次刷新页面
          if (this.code) {
            // 获取openid,存储将地址替换（防止刷新页面再次使用旧code请求）
            await postUserCode(this.code).then(res => {
              // 缓存openid
              sessionStorage.openid = res.data.openid
              const newPath = window.location.href.replace(window.location.search, '')
              location.replace(newPath)
            })
          } else {
            // 如果是授权第二次刷新页面，获取到openid记录在页面上
            if (sessionStorage.openid) {
              this.openid = sessionStorage.openid
              if (this.table.tableType === 1) {
                this.showPay = true
              } else {
                // 他评的情况
                this.otherTestOpen()
              }
              sessionStorage.removeItem('openid')
            }
          }
          // 支付页面回调
          this.payHandle()
        })
        // 获取优惠码
        this.getDiscountCode()
        // 加载微信分享
        this.share()
      }
    )
  },
  methods: {
    // 量表信息处理
    infoHandle (info) {
      info.pageHeaderImage = info.pageHeaderImage || require('@/assets/img/detail-bannner.png')
      this.table = Object.assign(this.table, info)
      // 判断是否有未完成的测试
      if (info.sessionId) {
        this.sessionId = info.sessionId
        this.go = 1
      } else {
        this.go = 0
      }
    },
    // 微信支付和支付宝支付回调处理
    payHandle () {
      // 支付页面回调
      const redirect = this.$route.query.redirect
      const orderid = this.$route.query.orderid
      // h5支付
      if (redirect === 'h5pay' && orderid) {
        this.thisDialog('刚才的订单支付了吗？', '已支付', 'confirm').then(() => {
          this.finishPay(orderid)
        }).catch(() => {
          this.payReplace()
        })
      } else if (redirect === 'alipay' && orderid) { // 支付宝支付
        if (this.$route.query.type === 'return') {
          this.finishPay(orderid)
        } else {
          // 取消支付的情况直接返回
          this.$router.go(-1)
        }
      }
    },
    // 获取优惠码
    getDiscountCode () {
      this.discountCode = this.$route.query.discountCode
      // 优惠码存在
      if (this.discountCode) {
        getTableDiscount(this.tableCode, this.discountCode).then(res => {
          // 更新优惠价
          this.discountAmount = res.data.price
        }).catch(err => {
          // 优惠码失效
          if (err.code === 2102 || err.code === 2103) {
            if (err.code === 2102) {
              // 活动已结束
              this.$toast(err.message)
            }
            this.discountAmount = this.table.price
            // 更新路由
            // const { discountCode, ...query } = this.$route.query
            // this.$router.replace({ query })
          }
        })
      }
    },
    // 确认支付
    payTest () {
      // 未登录
      if (!this.$store.state.phone) {
        this.$router.push({
          path: '/login',
          query: {
            url: this.$route.path,
            ...this.$route.query
          }
        })
        return
      }
      // 微信内未授权
      // 每次都授权
      // if (browser().weixin && !localStorage.openid) {
      if (browser().weixin && !this.openid) {
        const appid = 'wxb073a9d513bbcd43'
        const redirect = encodeURIComponent(window.location.href)
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
      } else {
        if (this.table.tableType === 1) {
          this.showPay = true
        } else {
          // 他评的情况
          this.otherTestOpen()
        }
      }
    },
    // 开始测试
    goTest () {
      // 未登录
      if (!this.$store.state.phone) {
        this.$router.push({
          path: '/login',
          query: {
            url: this.$route.path,
            ...this.$route.query
          }
        })
        return
      }
      sessionStorage.reportDisplayEnabled = 'true'
      sessionStorage.setMark = 'gerenpay'
      sessionStorage.tables = JSON.stringify([{ table: this.table }])
      this.$router.push(`/test-do-infos?sessionId=${this.sessionId}&tableCode=${this.tableCode}&tableType=${this.table.tableType}`)
    },
    // 他评窗口
    otherTestOpen () {
      this.otherTestDialog = true
    },
    // 选择是否开启摄像头后进行购买
    needOpenCamera (isOpen) {
      this.aiEvalCamEnabled = isOpen
      this.otherTestDialog = false
      this.showPay = true
      console.log(this.payInfo)
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
    // 完成支付
    finishPay (orderId, num = 0) {
      getOrderState(orderId).then(
        res => {
          if (res.data.orderStatus === 'success') {
            this.thisDialog('您已完成支付').then(() => {
              this.go = 1
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
          this.payReplace()
        }
      } else if (redirect === 'alipay') {
        // 支付后去除多余参数
        this.payReplace()
      } else {
        // 其他支付，成功后关闭支付弹窗
        if (state) {
          this.showPay = false
        }
      }
    },
    // 支付回调后地址参数的刷新
    payReplace () {
      const params = {
        path: this.$route.path,
        query: {
          tableCode: this.$route.query.tableCode
        }
      }
      if (this.$route.query.discountCode) params.query.discountCode = this.$route.query.discountCode
      this.$router.replace(params)
    },
    // 下单错误处理
    errMessage (err) {
      if (err.code === 1701) { // 通知量表下线
        this.thisDialog(`${this.table.tableName}被下线了`).then(() => {
          this.$router.push('/test-more')
        })
      } else if (err.code === 2102) { // 通知优惠失效
        this.thisDialog(err.message).then(() => {
          const path = `${this.$route.path}?tableCode=${this.$route.query.tableCode}`
          this.$router.replace(path)
          // 处理页面刷新
          this.$router.go(0)
        })
      } else if (err.code === 2104) { // 优惠错误
        this.thisDialog(err.message, '刷新').then(() => {
          this.$router.go(0)
        })
      }
      console.log(err)
    },
    // 收藏该量表
    collectHandle (data) {
      postTablecoll(data).then((res) => {
        if (data.type === '1') {
          this.$toast('收藏成功')
        } else {
          this.$toast('取消收藏')
        }
        this.table.currentUserIsColl = !this.table.currentUserIsColl
      }).catch(err => {
        if (err.code === 1701) {
          const msg = err.message
          this.thisDialog(msg).then(() => {
            this.$router.replace('/test-more')
          })
        }
      })
    },
    // 微信分享详情页
    share () {
      const currentUrl = window.location.href
      const dataForm = {
        title: this.table.tableName,
        desc: '我在云愈心理发现一份不错的量表，你也来测测看～',
        link: currentUrl,
        imgUrl: this.table.tableLogo
      }
      this.$store.dispatch('addShare', dataForm, () => {
        console.log('量表详情页加载分享')
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/test-report') {
      next(vm => { vm.reportBack = true })
    } else {
      next()
    }
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
  min-height: 5.6rem;
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
}
</style>
