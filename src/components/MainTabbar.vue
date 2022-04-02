<template>
  <div>
    <van-tabbar v-model="active" route active-color="#999999" inactive-color="#333" >
      <van-tabbar-item to="/test-more">
        <span>测试</span>
        <template #icon="props">
          <img :src="props.active ? ceIcon.active : ceIcon.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my-index">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? myIcon.active : myIcon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  data () {
    return {
      active: 0,
      ceIcon: {
        active: require('../assets/img/my/ce1.png'),
        inactive: require('../assets/img/my/ce.png')
      },
      myIcon: {
        active: require('../assets/img/my/my1.png'),
        inactive: require('../assets/img/my/my.png')
      }
    }
  },
  mounted () {
    const path = this.$route.path
    if (path === '/my-index') {
      this.active = 1
    } else {
      this.active = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
