<template>
  <div>
    <van-dialog v-model="show" :showConfirmButton="false" className="bind-dailog">
      <div class="title">
        <van-icon name="warning" size="16px" color="#F5B54C"/>
        <span>请您校对，确认信息是否一致</span>
      </div>
      <div class="content">
        <div class="item">
          <div class="item_label">机构名称：</div>
          <div class="item_value">{{detail.orgName}}</div>
        </div>
        <div class="item">
          <div class="item_label">批次号：</div>
          <div class="item_value">{{detail.batchId}}</div>
        </div>
        <div class="item">
          <div class="item_label">用户编号：</div>
          <div class="item_value">{{detail.userNumber}}</div>
        </div>
        <div class="item" v-for="(item) in detail.params" :key="item.index">
          <div class="item_label">
            {{item.key}}：
          </div>
          <div class="item_value">
            {{item.value}}
          </div>
        </div>
      </div>
      <div class="footer">
        <van-button round block plain  type="primary" @click="cancle">取消</van-button>
        <van-button round block  type="primary" @click="sure">确定</van-button>
      </div>
    </van-dialog>
    <van-dialog v-model="showKefu" :showConfirmButton="false" className="bind-dailog kefu-bind">
      <!-- <div class="close" @click="showKefu = false"><img  src="@/assets/img/my/close.png" alt="close"></div> -->
      <div class="title">您输入的信息已被其他人绑定，请联系客服~</div>
      <h4>联系微信</h4>
      <div class="wx"><img src="@/assets/img/my/wx.png" alt="wx"></div>
      <h4>客服电话</h4>
      <div class="phone">
        <img  src="@/assets/img/my/phone.png" alt="phone">
        <span @click="phoneClick('0512-6856-5993')">0512-6856-5993</span>
      </div>
      <div class="footer">
        <van-button round block  type="primary" @click="kefuButton">确定</van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  nam: 'BindDailog',
  props: {
    show: Boolean,
    showKefu: Boolean,
    detail: {
      type: Object
    }
  },
  methods: {
    sure () {
      this.$emit('sureAdd')
    },
    cancle () {
      this.$emit('update:show', false)
    },
    kefuButton () {
      this.$emit('update:showKefu', false)
    },
    // 拨打手机号
    phoneClick (phoneNum) {
      window.location.href = 'tel:' + phoneNum
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.bind-dailog{
  width: 260rem /@w;
  min-height: 200rem /@w;
  max-height: 443rem /@w;
  background: #FFFFFF;
  border-radius: 20rem /@w;
  padding: 30rem /@w  32rem /@w;
  display: flex;
  flex-direction: column;
  .title{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    span{
      margin-left: 3px;
    }
  }
  .content{
    max-height: 325rem/@w;
    margin-top: 20rem/@w;
    overflow-y: auto;
    .item{
      display: flex;
      justify-content: space-between;
      min-height: 20rem/@w;
      line-height: 20rem/@w;
      align-items: center;
      .item_label{
        white-space: nowrap;
        font-size: 14rem/@w;
        color: #666666;
      }
      .item_value{
        font-size: 14rem/@w;
        color: #333333;
        word-break: break-all;
      }
    }
    .item:not(:last-child){
      margin-bottom: 8rem/@w;
    }
  }
  .footer{
    display: flex;
    justify-content: space-around;
    margin-top: 24rem /@w;
    .van-button--block{
      width: 108rem /@w;
      height: 40rem /@w;
      font-weight: 600;
      font-size: 16rem /@w;
      border-width: 2px;
    }
  }
}
.kefu-bind{
  .title{
    text-align: center;
    margin-bottom: 25rem/@w;
  }
  h4{
      font-size: .373333rem;
      font-weight: 400;
      color: #333333;
      margin: 0;
      margin-bottom: .266667rem;
      text-align: center;
    }
    .wx{
      display: flex;
      justify-content:center;
      margin-bottom: .426667rem;
      img{
        width: 3.2rem;
        height: 3.2rem;
      }
    }
    .phone{
      display: flex;
      justify-content:center;
      align-items: center;
      img{
        width: .293333rem;
        height: .293333rem;
      }
      span{
        color: #34B7B9;
        font-size: .373333rem;
        margin-left: 5px;
      }
    }
}

</style>
