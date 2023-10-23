<template>
  <van-overlay :show="show">
    <div class="wait-prompt">
      全力加载中，请稍后...
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: 'wait-prompt',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.wait-prompt {
  width: 86%;
  height: 1.44rem;
  margin: 3rem auto 0;
  line-height: 1.44rem;
  text-align: center;
  font-weight: 500;
  color: #000000;
  background: #FFFFFF;
  border-radius: 12px;
}
</style>
