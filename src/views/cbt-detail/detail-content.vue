<template>
  <div class="detail">
    <!-- 详情描述 -->
    <div class="detail-wrap detail-img">
      <div>
        <img :src="item.url" :alt="item.name" v-for="item in detailPageImages" :key="item.index">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail-content',
  components: {
  },
  props: {
    detailPageImages: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@w: 37.5;
.detail-wrap {
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
