<template>
  <svg
    class="iconfont"
    aria-hidden="true"
    :style="style"
  >
    <use :xlink:href="name"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon-font',
  props: {
    name: String,
    width: {
      type: [Number, String],
      default: 16
    },
    height: {
      type: [Number, String],
      default: 16
    },
    color: String
  },
  computed: {
    style () {
      const style = {}
      if (this.width) {
        style.width = typeof this.width === 'number'
          ? this.width + 'px'
          : this.width
      }
      if (this.height) {
        style.height = typeof this.height === 'number'
          ? this.height + 'px'
          : this.height
      }
      if (this.color) style.color = this.color
      return style
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  width: 14px;
  height: 14px;
  fill: currentColor;
}
</style>
