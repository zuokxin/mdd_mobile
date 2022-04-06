<template>
  <div class="detail-header">
    <p class="title">{{ tableName }}</p>
    <p><span class="now">￥{{ discountAmountInfo }}</span><span class="normal" v-show="discountAmountInfo !== price">￥{{ price }}</span></p>
  </div>
</template>

<script>
export default {
  name: 'detail-header',
  props: {
    tableName: String,
    discountAmountInfo: String,
    price: String
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
    font-size: 18rem / @w;
    font-weight: 700;
    color: #333333;
  }
  .now {
    font-size: 20rem / @w;
    font-weight: 700;
    color: #EB5940;
  }
  .normal {
    margin-left: 10rem / @w;
    font-size: 12rem / @w;
    font-weight: 400;
    color: #CCCCCC;
    text-decoration: line-through;
  }
}
</style>
