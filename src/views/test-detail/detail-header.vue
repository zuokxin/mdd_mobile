<template>
  <div class="detail-header">
    <div class="title">{{ tableName }}</div>
    <div class="price-box">
      <span class="now">￥{{ discountAmountInfo }}</span>
      <span v-show="discountAmountInfo !== price" class="normal normal-price">￥{{ price }}</span>
    </div>
    <van-row>
      <van-col class="content-box">
        <div class="normal-num">{{ questionNumber }}</div>
        <div class="normal normal-title">题数</div>
      </van-col>
      <van-col class="content-box">
        <div class="normal-num">{{ time }}min</div>
        <div class="normal normal-title">耗时</div>
      </van-col>
      <van-col class="content-box">
        <div class="normal-num">{{ curEvalRecordCount }}</div>
        <div class="normal normal-title">测试人数</div>
      </van-col>
      <van-col class="content-box-right" :class="{collected: currentUserIsColl}" @click="collectHandle">
        <!-- 收藏 -->
        <img :src="currentUserIsColl ? collect.icon1 : collect.icon" alt="collect">
        <div class="name">{{currentUserIsColl ? collect.name1 : collect.name}}</div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'detail-header',
  props: {
    tableName: String, // 量表名
    tableCode: String, // 量表code
    discountAmountInfo: String, // 折扣价格
    price: String, // 原始价格
    evalRecordCount: Number, // 测试人数
    time: String, // 时间范围
    questionNumber: Number, // 题目数量
    currentUserIsColl: Boolean // 当前用户是否收藏
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
  // watch: {
  //   currentUserIsColl (val) {
  //     this.isCollect = val
  //   }
  // },
  data () {
    return {
      // isCollect: this.currentUserIsColl,
      collect: {
        name: '收藏',
        icon: require('@/assets/img/collect.png'),
        name1: '已收藏',
        icon1: require('@/assets/img/collect-active.png')
      }
    }
  },
  methods: {
    collectHandle () {
      const data = {
        tableCode: this.tableCode,
        type: this.currentUserIsColl ? '2' : '1'
      }
      this.$emit('collect', data)
    }
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
  margin-bottom: 10rem / @w;
  border-radius: 12px 12px 0px 0px;
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
  .normal-price {
    margin-left: 10rem / @w;
    text-decoration: line-through;
    color: #CCCCCC;
  }
  .normal-title {
    color: #999999;
  }
  .normal-num {
    margin-bottom: .25em;
    font-size: 16rem / @w;
    font-weight: 700;
    color: #666666;
  }
  .content-box {
    margin-right: 24rem / @w;
  }
  .content-box-right {
    float: right;
    width: 70rem / @w;
    height: 28rem / @w;
    border: 1px solid #F5B54C;
    border-radius: 15rem / @w;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    img{
      width: 14rem / @w;
      height: 14rem / @w;
    }
    .name{
      font-size: 12rem / @w;
      font-weight: 400;
      color: #F5B54C;
      margin-left: 2rem / @w;
    }
  }
  .collected{
    border: 0;
    background: #F6F6F7;
  }
}
</style>
