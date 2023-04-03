<template>
  <div>
    <div class="main">
      <div class="boxRight" :style="boxWidth">
        {{ testString }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-box-right',
  props: {
    textRight: Number
  },
  computed: {
    testString () {
      let res = ''
      if (this.textRight > 60) {
        res = parseInt(this.textRight / 60) + " ' " + (this.textRight % 60) + " '' "
      } else {
        res = this.textRight + " '' "
      }
      return res
    },
    // 语音条尺寸
    boxWidth () {
      let res = ''
      // 最大尺寸
      const maxWidth = parseInt(document.body.clientWidth * 0.6)
      const scale = maxWidth / 20
      // 最小尺寸
      const minWidth = 58
      const curWidth = this.textRight * scale
      if (curWidth >= maxWidth) res = maxWidth
      else if (curWidth <= minWidth) res = minWidth
      else res = curWidth
      return `width: ${res}px`
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.boxRight {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  width:100px;
  height:36px;
  margin: 10px 45px 10px 0;
  padding: 5px 11px;
  font-size: 14px;
  color: #fff;
  font-weight: 400;
  background: rgba(52, 183, 185, .8);
  border-radius: 8px;
}
.boxRight:after {
    content: '';
    position: absolute;
    right: -16px;
    bottom: -7px;
    width: 15px;
    height: 26px;
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    margin-right: -1px;
    border-bottom-width: 8px;
    border-bottom-color: currentColor;
    border-radius: 0 0 58px 0;
    color: rgba(52, 183, 185, .8);
    transform: rotateZ(75deg);
}
</style>
