<template>
  <div class="popout" >
    <div class="popout_box">
      <div class="text">{{popoutText || '请认真阅读并支付后开始测评'}}</div>
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popout',
  props: {
    popoutText: String
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
    height: 243rem / @w;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    .text{
      font-size: 16rem / @w ;
      color: #000000;
      margin-top: 63rem / @w;
      margin-bottom: 78rem / @w;
      font-weight: 700;
    }
    // --------------
    .sure-btn{
      border-radius: 20rem / @w;
      width: 86rem / @w;
      height: 40rem / @w;
      font-size: 16rem / @w ;
    }
  }
}
</style>
