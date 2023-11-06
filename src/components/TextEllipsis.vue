<template>
  <div class="text-ellipsis-wrapper">
    <div class="text" ref="text">
      {{ info }}
      <span class="btn" v-if="show && isfold" @click="unfold">...【展开】</span>
      <span class="btn fold" @click="fold" v-if="show && !isfold">【收起】</span>
    </div>
  </div>
</template>
<script>
// import { throttle } from '@/utils/throttle.js'
export default {
  name: 'TextEllipsis',
  props: {
    info: {
      type: String,
      default: ''
    },
    lineClamp: {
      type: Number,
      default: 3
    },
    hiddenBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      isfold: true,
      h: 0, // div.text元素高
      lh: 0, // 行高
      a: 1
    }
  },
  watch: {
    info () {
      this.getHeight()
      console.log('变化')
    }
  },
  mounted () {
    this.getHeight()
    this.a = 222
    console.log('aaa', this.a)
  },
  methods: {
    getHeight () {
      this.h = this.$refs.text.clientHeight
      this.lh = getComputedStyle(this.$refs.text).getPropertyValue('line-height')
      this.lh = parseFloat(this.lh)
      console.log('this.lh', this.lh, 'this.h', this.h, 'ele', this.$refs.text)
      if (this.h > this.lh * this.lineClamp) {
        this.show = true
        this.isfold = true
        this.$refs.text.style.height = `${this.lineClamp * this.lh}px`
      } else {
        this.isfold = false
      }
    },
    unfold () {
      this.isfold = false
      this.$refs.text.style.height = `${this.h + this.lh}px`
    },
    fold () {
      this.isfold = true
      this.$refs.text.style.height = `${this.lineClamp * this.lh}px`
    }
  }
}
</script>
<style lang="less">
@w:37.5;
.text-ellipsis-wrapper {
  display: flex;
  // margin: 6rem/@w 0 18rem/@w 0;
  // height: 18rem/@w;
  overflow: hidden;
  font-size: 12rem/@w;
  line-height: 18rem/@w;
  .text {
    position: relative;
    .btn {
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: #fff;
      color: #34B7B9;
    }
  }
}
</style>
