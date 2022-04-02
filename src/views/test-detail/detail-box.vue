<template>
  <div class="detail-box">
    <div class="title">
      <img src="@/assets/img/detail-title-icon.png" alt="title-icon">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail-box',
  props: {
    title: String
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.detail-box {
  .title {
    font-size: 14rem / @w;
    font-weight: 700;
    color: #333333;
    img {
      width: 17rem / @w;
    }
    span {
      margin-left: 10rem / @w;
    }
  }
  .content {
    font-size: 14rem / @w;
    color: #666666;
  }
  /deep/h3 {
    font-size: 14rem / @w;
  }
}
</style>
