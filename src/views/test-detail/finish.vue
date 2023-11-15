<template>
  <div class="popout">
    <div class="popout_box">
      <div class="text">您已完成测试，可前往查看记录</div>
      <van-button class="sure-btn" type="primary" @click="disponseBackPath()">确定</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popout',
  methods: {
    disponseBackPath () {
      const type = sessionStorage.getItem('backType')
      if (type === '2') {
        this.$router.replace('/my-record?type=2')
      } else {
        this.$router.replace('/my-record')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;

.popout {
  z-index: 999;
  width: 100vw;
  height: calc(100 * var(--vh));
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  .popout_box {
    position: relative;
    border-radius: 20px;
    max-width: 80%;
    width: 324rem / @w;
    height: 243rem / @w;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;

    .text {
      font-size: 16rem / @w ;
      color: #000000;
      margin-top: 63rem / @w;
      margin-bottom: 78rem / @w;
      font-weight: 700;
    }

    // --------------
    .sure-btn {
      border-radius: 20rem / @w;
      width: 86rem / @w;
      height: 40rem / @w;
      font-size: 16rem / @w ;
    }
  }
}</style>
