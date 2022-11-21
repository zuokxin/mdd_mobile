<template>
  <div class="popout" >
    <div class="popout_box">
      <div class="title">您输入的信息已被其他人绑定，请联系客服~</div>
      <h6>联系微信</h6>
      <div class="wx"><img src="@/assets/img/my/wx.png"></div>
      <h6>客服电话</h6>
      <div class="phone">
        <img src="@/assets/img/my/phone.png">
        <span @click="phoneClick('0512-6856-5993')">0512-6856-5993</span>
      </div>
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popout',
  methods: {
    phoneClick (phoneNum) {
      window.location.href = 'tel:' + phoneNum
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.popout{
z-index: 999;
width: 100vw;
height: 100vh;
background-color: rgba(0, 0, 0, 0.4);
position: fixed;
left: 0;
top: 0;
display: flex;
overflow: hidden;
justify-content: center;
align-items: center;
  .popout_box{
    position: relative;
    border-radius: 20px;
    max-width: 80%;
    width: 324rem / @w;
    height: 427rem / @w;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    padding: 30rem / @w  42rem / @w 40rem / @w;
    box-sizing: border-box;
    .title{
      color: #333333;
      font-size: 16rem / @w;
      font-weight: 600;
      text-align: center;
      margin-bottom: 25rem / @w;
    }
    h6{
      margin-bottom: 11rem / @w;
      font-weight: 500;
      font-size: 14rem / @w;
      color: #333333;
      margin-top: 0;
    }
    .wx{
      text-align: center;
      margin-bottom: 16rem / @w;
      img{
        width: 120rem / @w;
        height: 120rem / @w;
      }
    }
    .phone{
      display: flex;
      flex-wrap: nowrap;
      color: #34B7B9;
      font-size: 14rem / @w;
      justify-content: center;
      align-items: center;
      margin-bottom: 29rem / @w;
      img{
        width: 11rem / @w;
        height: 11rem / @w;
        margin-right: 4rem /@w;
      }
    }
    .service-sure-btn{
      border-radius: 25rem / @w;
      width: 108rem / @w;
      height: 40rem / @w;
      font-size: 16rem / @w ;
    }
  }
}
</style>
