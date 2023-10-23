<template>
  <div class="time">
    <span v-if="type">{{dayjs(new Date() * 1000).format('M月DD日 HH:mm')}}</span>
    <span v-else>{{dayjs(new Date() * 1000).format('HH:mm')}}</span>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'time-show',
  data () {
    return {
      dayjs: dayjs
    }
  },
  props: {
    type: Boolean
  }
}
</script>
<style scoped lang="less">
.time{
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
