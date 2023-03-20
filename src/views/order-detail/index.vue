<template>
  <div class="detail">
    <!-- 订单详情图片 -->
    <div class="detail-panel">
      <img :src="customImage" alt="">
    </div>
    <!-- 支付弹窗 -->
    <pay-action
      :payInfo="payInfo"
      :visible.sync="showPay"
      userPayType="organ"
      @finishPay="finishPay"
      @errMessage="errMessage"
    ></pay-action>
    <!-- 足部操作区 -->
    <van-goods-action :safe-area-inset-bottom="true">
      <van-goods-action-icon to="/my-bind" text="我的测评"/>
      <van-goods-action-button
        v-if="status === 0"
        type="primary"
        :text="btnInfo"
        @click="onClickButton"
      />
      <van-goods-action-button
        v-else
        type="primary"
        :text="btnGoInfo"
        @click="goTest"
      />
    </van-goods-action>
    <!-- 去绑定的弹窗 -->
    <popout v-if="popoutFlag">
      <template slot="btn">
        <van-button class="sure-btn" type="primary" @click="toBind">确定</van-button>
      </template>
    </popout>
    <!-- 联系客服的弹窗 -->
    <ContactService v-if="contactServiceFlag">
      <template slot="btn">
        <!-- 点完确定按钮后置灰也可 -->
        <van-button class="service-sure-btn" type="primary" @click="contactServiceFlag = false">确定</van-button>
      </template>
    </ContactService>
    <!-- 错误批次弹窗 -->
    <popout v-if="errPopout"  :popoutText="errText">
      <template slot="btn">
        <van-button class="sure-btn" type="primary" @click="errPopout = false">确定</van-button>
      </template>
    </popout>
    <Finish v-if="reportBack" />
  </div>
</template>

<script>
import PayAction from '@/components/PayAction.vue'
import popout from './popout'
import Finish from './finish.vue'
import ContactService from './contactService'
import { Dialog } from 'vant'
import { getOrderState, postUserCode } from '@/api/index'
import { newUserReward } from '@/api/modules/user'
import { batchInfo, batchTables, createAndBind, userBatchInfo } from '@/api/modules/order-detail'
// import wxShare from '@/utils/wxShare'
import browser from '@/utils/browser'
const params = new URLSearchParams(window.location.search)
export default {
  name: 'test-detail',
  components: {
    PayAction,
    popout,
    ContactService,
    Finish
  },
  data () {
    return {
      tableName: '',
      discountAmount: 0, // 折扣价格
      showPay: false, // 付款弹窗
      code: '', // 微信code
      sessionId: '', // 当前测试的sessionid
      tableCode: '',
      hasOtherTable: false, // 是否包含他评量表
      aiEvalCamEnabled: false,
      tables: [], // 简单表
      userSelect: [], // 详细的选择表
      popoutFlag: false,
      contactServiceFlag: false,
      errCode: 0,
      status: 0,
      continue: false,
      customImage: '',
      organ: '',
      amount: '0.00', // 价钱
      errPopout: false,
      errText: '',
      reportBack: false
    }
  },
  computed: {
    // 支付框所需信息
    payInfo () {
      return {
        price: this.amount,
        tableName: this.tableName,
        discountAmount: this.amount,
        // tables: [this.tableCode],
        aiEvalCamEnabled: this.aiEvalCamEnabled,
        sessionId: this.sessionId
      }
    },
    // 耗时须知文本
    time () {
      const min = this.table.minTimeMinute || 0
      const max = this.table.maxTimeMinute || 0
      return min === max ? min : `${min}~${max}`
    },
    btnInfo () {
      return `确认支付（¥${this.amount}）`
    },
    // 去测试按钮文案
    btnGoInfo () {
      return this.continue ? '继续测试' : '开始测试'
    }
  },
  watch: {
  },
  mounted () {
    this.batchId = this.$route.query.batchId
    this.organ = this.$route.query.organ
    this.getBatch()
    if (localStorage.getItem('phone')) {
      this.$store.dispatch('getInfo').then(res => {
        if (res.data.isNewUser && !res.data.isRxNUReward) {
          newUserReward()
        }
      })
    }
    this.$nextTick(async () => {
      // 微信授权
      this.code = params.get('code') || ''
      if (!localStorage.openid && this.code) {
        await postUserCode(this.code).then(res => {
          localStorage.openid = res.data.openid
        })
      }
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
    })
  },
  methods: {
    // 订单获取图
    getBatch () {
      batchInfo({ id: this.batchId }).then(res => {
        if (res.code === 0) {
          if (res.data.payee === 'user') {
            this.customImage = res.data.customImage
            this.amount = res.data.amount
            if (res.data.reportDisplayEnabled === 1) {
              sessionStorage.setItem('reportDisplayEnabled', 'true')
            } else {
              sessionStorage.setItem('reportDisplayEnabled', 'false')
            }
            if (this.$route.query.sessionId) {
              this.sessionId = this.$route.query.sessionId
              this.getNeedTests()
            } else {
              this.getBatchTables()
            }
          }
        }
      }).catch(err => {
        this.errText = err.message
        this.errPopout = true
      })
    },
    // 是否绑定+弹窗
    getBatchTables () {
      batchTables({ batchId: this.batchId }).then(res => {
        if (res.code === 0) {
          if (res.data.sessionId === '') {
            this.popoutFlag = true
            // this.payStatus = res.data.payStatus
          } else {
            this.sessionId = res.data.sessionId
            this.getNeedTests()
            // if (res.data.payStatus === 'success') {
            //   this.go = true
            // }
          }
          // 支付状态 下一步操作可以做
        }
      }).catch(err => {
        // 弹窗2302的弹窗窗口只有2302联系客服的弹窗
        console.log(err)
        if (err.code === 2302) {
          this.errCode = 2302
          this.contactServiceFlag = true
        }
      })
    },
    // 确定&绑定下只会成功-不会有问题
    toBind () {
      createAndBind({ batchId: this.batchId, orgMarking: this.organ }).then(res => {
        if (res.code === 0) {
          this.popoutFlag = false
          this.sessionId = res.data
          this.getNeedTests()
        }
      })
    },
    onClickButton () {
      // 未登录
      if (!localStorage.phone) {
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
      if (this.errText) {
        this.errPopout = true
      } else {
        if (browser().weixin && !localStorage.openid) {
          const appid = 'wxb073a9d513bbcd43'
          const redirect = encodeURIComponent(window.location.href)
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
        } else {
          this.showPay = true
        }
      }
    },
    // 调接口存下需要做的表
    getNeedTests () {
      userBatchInfo({ sessionId: this.sessionId }).then(response => {
        if (response.code === 0) {
          const userSelect = []
          this.tables = []
          if (response.data.status !== 0) {
            this.status = response.data.status
          }
          this.continue = response.data.status === 2
          response.data.evalRecords.forEach(e => {
            this.tableName += e.table.tableName + '、'
            if (e.finishedAt === 0) {
              // this.tables.push(e.table.tableCode)
              userSelect.push({ table: e.table, tableType: e.table.tableType, tableCode: e.table.tableCode, finishedAt: e.finishedAt })
            }
            this.tables.push({ table: e.table, tableType: e.table.tableType, tableCode: e.table.tableCode, finishedAt: e.finishedAt })
          })
          this.hasOtherTable = userSelect.some(e => e.table.tableType === 2)
          this.userSelect = userSelect
          sessionStorage.setItem('tables', JSON.stringify(userSelect))
          // console.log(this.continue)
          // console.log(this.tableName)
          // console.log(this.tables, '用户选择的简单表')
          // console.log(this.hasOtherTable, '是否有他评')
          // console.log(this.userSelect, '用户选择的复杂详细表')
        }
      })
    },
    // 开始测试
    goTest () {
      // console.log(this.tables)
      // console.log(this.userSelect[0])
      sessionStorage.setMark = 'jigoupay'
      if (this.tables.length > this.userSelect.length) {
        this.$router.push(`/test-do-start?sessionId=${this.sessionId}&tableCode=${this.userSelect[0].table.tableCode}&tableType=${this.userSelect[0].table.tableType}`)
      } else {
        this.$router.push(`/test-do-infos?sessionId=${this.sessionId}&tableCode=${this.userSelect[0].table.tableCode}&tableType=${this.userSelect[0].table.tableType}`)
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
              // this.go = true
              this.sessionId = res.data.sessionId
              this.refresh(1)
              this.getNeedTests()
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
    // 支付回调的刷新
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
    }
    // 微信分享详情页
    // share () {
    //   const currentUrl = window.location.href
    //   const dataForm = {
    //     title: this.table.tableName,
    //     desc: '我在云愈心理发现一份不错的量表，你也来测测看～',
    //     link: currentUrl,
    //     imgUrl: this.table.tableLogo
    //   }
    //   wxSignatures({ url: currentUrl }).then(res => {
    //     if (res.code === 0) {
    //       wxShare.getJSSDK(res.data, dataForm)
    //     }
    //   })
    // }
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
.detail {
  background: #F6F6F7;
  .detail-panel{
    img{
      width: 100%;
      height: 100%;
    }
  }
  .van-goods-action {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.06);
  }
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
</style>
