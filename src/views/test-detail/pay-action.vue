<template>
  <van-action-sheet v-model="payVisible" :close-on-click-overlay="false" title="支付">
    <div class="pay-content">
      <div class="box-padding">
        <van-row style="margin-bottom: 16px;">
          <van-col class="head-left" span="4">购买</van-col>
          <van-col class="head-right table-name" span="20">{{ payInfo.tableName }}</van-col>
        </van-row>
        <van-row>
          <van-col class="head-left" span="4">价格</van-col>
          <van-col class="head-right" span="20">
            <span class="amount-old">￥{{ payInfo.price }}</span>
            <span class="amount-now">￥{{ payInfo.discountAmount }}</span>
          </van-col>
        </van-row>
      </div>
      <van-divider />
      <div class="pay-box box-padding">
        <p>选择支付方式</p>
        <van-radio-group v-model="result">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in list"
              clickable
              :key="index"
              :title="item.name"
              @click="result = item.name"
            >
              <template #title>
                <div class="pay-box-left">
                  <img class="pay-icon" :src="item.src" alt="pay-icon">
                  <span class="pay-title">{{ item.name }}</span>
                </div>
              </template>
              <template #right-icon>
                <van-radio :name="item.name">
                  <template #icon="props">
                    <div class="inactiveIcon-icon">
                      <img v-show="props.checked" class="activeIcon-icon" src="@/assets/img/pay-check.png" />
                    </div>
                  </template>
                </van-radio>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="pay-button">
        <van-button round type="primary" :disabled="result === ''" @click="pay">确认支付（￥{{ payInfo.discountAmount }}）</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
import { Dialog } from 'vant'
import { postTableOrder } from '@/api/index'
import browser from '@/utils/browser'
export default {
  name: '',
  props: {
    payInfo: Object,
    visible: Boolean
  },
  data () {
    return {
      orderId: '', // 订单编号
      result: '', // 选择支付类型
      // amount: '9.9',
      show: true,
      list: [
        {
          name: '支付宝',
          src: require('@/assets/img/pay-ali.png')
        },
        {
          name: '微信',
          src: require('@/assets/img/pay-wx.png')
        }
      ],
      weixin: browser().weixin
    }
  },
  computed: {
    // 支付类型
    payType () {
      if (this.result === '') return null
      if (this.result === '支付宝') {
        return 'alipay'
      } else {
        if (this.weixin) {
          return 'jsapi'
        } else {
          return 'h5'
        }
      }
    },
    payVisible: {
      get () {
        return this.visible
      },
      set (newValue) {
        // this.visible = newValue
        this.$emit('update:visible', newValue)
      }
    }
  },
  created () {
    // 微信内只显示微信支付
    if (this.weixin) {
      this.result = '微信'
      this.list.splice(0, 1)
    }
  },
  methods: {
    // 支付事件
    pay () {
      if (this.payType === 'jsapi') {
        this.wxJsapi()
      } else if (this.payType === 'h5') {
        this.wxH5pay()
      } else if (this.payType === 'alipay') {
        this.getParam('alipay').then(
          res => {
            console.log(res)
          }
        )
      }
    },
    // 微信内支付
    async wxJsapi () {
      const { data } = await this.getParam('wxpay')
      const wxPayInfo = data.wxPayInfo
      this.orderId = data.orderId
      const param = {
        appId: wxPayInfo.appid,
        timeStamp: wxPayInfo.timestamp,
        nonceStr: wxPayInfo.noncestr,
        package: wxPayInfo.package,
        signType: 'RSA',
        paySign: wxPayInfo.paySign
      }
      if (this.payInfo.discountAmount === '0.00') {
        this.$emit('finishPay', this.orderId)
        return
      }
      const vm = this
      /* eslint-disable */
      WeixinJSBridge.invoke('getBrandWCPayRequest', param,
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            vm.payVisible = false
            vm.$emit('finishPay', vm.orderId)
          } else {
            Dialog.alert({
              message: '支付失败',
              theme: 'round-button',
              className: 'detail-dialog',
              confirmButtonColor: '#34B7B9'
            })
          }
        }
      )
      /* eslint-enable */
    },
    // 微信H5支付
    async wxH5pay () {
      const paramRes = await this.getParam('wxpay')
      this.orderId = paramRes.data.orderId
      if (this.payInfo.discountAmount === '0.00') {
        this.$emit('finishPay', this.orderId)
        return
      }
      const redirect = encodeURIComponent(window.location.origin + window.location.pathname + window.location.hash + '&redirect=h5pay&orderid=' + this.orderId)
      const h5Url = paramRes.data.wxPayInfo.h5Url
      window.location.href = h5Url + '&redirect_url=' + redirect
    },
    // 提交订单信息
    getParam (type) {
      const wxPayType = this.weixin ? 'jsapi' : 'h5'
      return postTableOrder({
        tables: this.payInfo.tables,
        aiEvalCamEnabled: false,
        totalAmount: this.payInfo.discountAmount,
        payMethod: type,
        originAmount: this.payInfo.price,
        couponsId: 0,
        wxPayType: wxPayType
      })
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.pay-content {
  padding-left: 20rem / @w;
  padding-right: 20rem / @w;
  font-size: 14rem / @w;
  color: #333333;
  .box-padding {
    padding-left: 20rem / @w;
    padding-right: 20rem / @w;
  }
  .head-right {
    text-align: right;
    &.table-name {
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space:nowrap;
    }
  }
  .head-left {
    color: #999999;
  }
  .amount-old {
    text-decoration: line-through;
    font-size: 12rem / @w;
    color: #D5D5D5;
  }
  .amount-now {
    font-size: 20rem / @w;
    font-weight: 700;
    color: #EB5940;
  }
  .van-divider {
    border-color: #707070;
    border-style: dashed;
  }
}
.pay-button {
  padding-top: 14rem / @w;
  padding-bottom: 40rem / @w;
  padding-left: 12rem / @w;
  padding-right: 12rem / @w;
  .van-button {
    width: 100%;
  }
}
.pay-icon {
  width: 35rem / @w;
}
.pay-title {
  font-size: 14rem / @w;
  font-weight: 700;
  color: #333333;
  padding-left: 13rem / @w;
}
.pay-box-left {
  display: flex;
  align-items: center;
}
.pay-box {
  .inactiveIcon-icon {
    position: relative;
    width: 28rem / @w;
    height: 28rem / @w;
    &::before {
      content: "";
      width: 18rem / @w;
      height: 18rem / @w;
      background: #F6F6F6;
      border-radius: 50%;
      transform: translateX(30%);
      display: inline-block;
    }
  }
  .activeIcon-icon {
    position: absolute;
    width: 100%;
    left: 0;
    top: -20%;
  }
}
</style>
