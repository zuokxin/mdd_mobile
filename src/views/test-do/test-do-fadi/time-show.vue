<template>
  <div class="time">
    <span v-if="type">{{DateFormat({date: new Date(),format: 'M月dd日 hh:mm'})}}</span>
    <span v-else>{{DateFormat({date: new Date(),format: 'hh:mm'})}}</span>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/date'
export default {
  name: 'time-show',
  data () {
    return {
      DateFormat: DateFormat
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
  color: #CCCCCC;
}
</style>
