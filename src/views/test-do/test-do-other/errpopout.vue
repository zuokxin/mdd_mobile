<template>
  <div class="popout" v-if="errPopout">
    <div class="popout_box">
        <slot name="text"></slot>
        <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popout',
  props: {
    errPopout: Boolean
  }
}
</script>

<style lang="less" scoped>
.popout{
  z-index: 99999;
  width: 100vw;
  font-size: 16px;
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
    width: 80%;
    // width: calc(100% - 2rem);
    height: 6.5676rem;
    background-color: #FFFFFF;
    overflow: hidden;
  }
}
</style>
