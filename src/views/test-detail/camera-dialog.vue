<template>
  <van-overlay :show="show" @click="$emit('update:show', false)">
    <div @click.stop>
      <div class="van-dialog camera-dialog">
        <div class="content">
          测评此量表会进行人脸识别，打开摄像头会使您的测评结果更准确，请问您是否开启？
        </div>
        <div class="btns">
          <van-button type="primary" plain round @click="$emit('needOpenCamera', false)">直接购买</van-button>
          <van-button type="primary" round @click="$emit('needOpenCamera', true)">开启</van-button>
        </div>
        <div class="footer">
          <div class="icon"><van-icon name="down" /></div><span @click="$router.push('/testing')">去检测</span>您当前的设备是否满足此量表测试
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
// import { Overlay, Button } from 'vant'
export default {
  name: 'camera-dialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
@w: 37.5;
.camera-dialog {
  width: 324rem / @w;
  padding: 63rem / @w 42rem / @w 40rem / @w;
  box-sizing: border-box;
  color: #666666;
  .content {
    margin-bottom: 26rem / @w;
    font-size: 16rem / @w;
    font-weight: 700;
    color: #000000;
    text-align: center;
  }
  .btns {
    display: flex;
    padding: 0 10rem / @w 12rem / @w;
    justify-content: space-between;
    .van-button {
      width: 105rem / @w;
      height: 40rem / @w;
      font-size: 16rem / @w;
      &.van-button--plain .van-button__content {
        color: #34B7B9;
      }
    }
  }
  .footer {
    span {
      color: #34B7B9;
    }
    font-size: 14rem / @w;
    .icon {
      display: inline-block;
      width: 16rem / @w;
      height: 16rem / @w;
      line-height: 16rem / @w;
      background: #34B7B9;
      color: #fff;
      border-radius: 50%;
      text-align: center;
      transform: rotateZ(-90deg);
      font-size: 12rem / @w;
      margin-right: 5rem / @w;
    }
  }
}
</style>
