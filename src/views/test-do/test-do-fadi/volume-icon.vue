<template>
  <div class="volume">
    <div class="icon" :class="{'active': volumeActive >= item}" v-for="item in 10" :key="item"></div>
  </div>
</template>

<script>
export default {
  name: 'volume-icon',
  props: {
    value: Number
  },
  data () {
    return {
    }
  },
  computed: {
    volumeActive () {
      if (!this.value) return -1
      const val = Math.ceil(this.value / 10)
      if (val > 10) return 10
      return val
    }
  }
}
</script>
<style scoped lang="less">
.volume {
  display: inline-block;
  .icon {
    display: inline-block;
    width: 4px;
    height: 24px;
    border-radius: 4px;
    background-color: #EBEBED;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      background-color: #34B7B9;
    }
  }
}
</style>
