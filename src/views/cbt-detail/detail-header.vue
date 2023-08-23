<template>
  <div class="detail-header">
    <div class="title">{{ name }}</div>
    <div class="price-box">
      <span class="now">￥{{ price }}</span>
    </div>
    <van-row>
      <van-col class="content-box">
        <div class="normal-num">{{ time }}min</div>
        <div class="normal normal-title">耗时</div>
      </van-col>
      <van-col class="content-box">
        <div class="normal-num">{{ curEvalRecordCount }}</div>
        <div class="normal normal-title">练习人次</div>
      </van-col>
      <!-- <van-col class="content-box-right">
      </van-col> -->
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'detail-header',
  props: {
    name: String, // 名称
    price: String, // 原始价格
    evalRecordCount: Number, // 测试人数
    time: String // 时间范围
  },
  components: {
  },
  computed: {
    // 测试人数格式化
    curEvalRecordCount () {
      if (this.evalRecordCount < 10000) return this.evalRecordCount
      else {
        const tenThousand = this.evalRecordCount / 10000
        if (tenThousand >= 10000) return '9999.9w'
        const curString = tenThousand.toFixed(1)
        return curString + 'w'
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.detail-header {
  position: relative;
  z-index: 1;
  padding-left: 20rem / @w;
  padding-right: 20rem / @w;
  padding-top: 16rem / @w;
  padding-bottom: 20rem / @w;
  margin-top: -12rem / @w;
  background: #fff;
  .title {
    margin-bottom: 10rem / @w;
    font-size: 18rem / @w;
    font-weight: 700;
    color: #333333;
  }
  .price-box {
    margin-bottom: 17rem / @w;
  }
  .now {
    font-size: 20rem / @w;
    font-weight: 700;
    color: #EB5940;
  }
  .normal {
    font-size: 12rem / @w;
    font-weight: 400;
  }
  .normal-title {
    color: #999999;
  }
  .normal-num {
    margin-bottom: .25em;
    font-size: 16rem / @w;
    // font-weight: 700;
    color: #666666;
  }
  .content-box {
    margin-right: 24rem / @w;
  }
}
</style>
