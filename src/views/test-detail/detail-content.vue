<template>
  <div class="detail">
    <!-- 详情描述 -->
    <div class="detail-wrap detail-img" v-if="table.detailPageMode === 1">
      <div>
        <img :src="item.url" alt="" v-for="item in table.detailPageImages" :key="item.index">
      </div>
    </div>
    <div class="detail-wrap" v-else>
      <div >
        <detail-box v-if="table.introduction" title="测评介绍">
          <p>{{ table.introduction }}</p>
        </detail-box>
        <detail-box v-if="table.applicablePeople" title="适合谁测">
          <p>{{ table.applicablePeople }}</p>
        </detail-box>
        <detail-box v-if="table.evaluationDirection" title="你将获得">
          <p>{{ table.evaluationDirection }}</p>
        </detail-box>
        <detail-box v-if="table.reference" title="参考文献">
          <p>{{ table.reference }}</p>
        </detail-box>
        <detail-box v-if="table.tips && table.tips.length" title="测评须知">
          <p v-for="(tip, index) in table.tips" :key="tip">
            <span v-if="table.tips.length > 1">{{ index+1 }}.</span>
            <span>{{ tip }}</span>
          </p>
        </detail-box>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import DetailBox from './detail-box.vue'
export default {
  name: 'detail-content',
  components: {
    DetailBox
  },
  props: {
    table: {
      type: Object,
      default: () => {
        return {
          tableName: '--',
          price: 0,
          detail: '--',
          minTimeMinute: 0,
          maxTimeMinute: 0,
          applicablePeople: '--',
          evaluationDirection: '--',
          tips: [],
          reference: '',
          questionNumber: 0,
          evalRecordCount: 0,
          kudosNumber: 0,
          currentUserIsKudos: true,
          currentUserIsColl: false,
          tableLogo: '',
          detailPageMode: '',
          detailPageImages: []
        }
      }
    }
  },
  data () {
    return {
      tableCode: ''
    }
  },
  async mounted () {
    this.tableCode = this.$route.query.tableCode
  },
  methods: {
    // 弹窗封装
    thisDialog (message) {
      return Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: '确定',
        confirmButtonColor: '#34B7B9'
      })
    }
  }
}
</script>
<style lang="less" scoped>
@w: 37.5;
.detail-wrap {
  padding-left: 20rem / @w;
  padding-right: 20rem / @w;
  padding-bottom: 50rem / @w;
  background: #fff;
  img{
    width: 100%;
    display: block;
  }
}
.detail-img{
  padding-left: 0;
  padding-right: 0;
}
</style>
