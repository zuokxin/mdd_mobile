<template>
  <div>
    <van-tabbar v-model="active" route active-color="#999999" inactive-color="#333" >
      <van-tabbar-item
        v-for="item in navBarItems"
        :key="item.title"
        :to="item.path"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="iconChange(props.active, item)" />
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
      navBarItems: [
        {
          title: '首页',
          path: '/home',
          active: require('../assets/img/my/home1.png'),
          inactive: require('../assets/img/my/home.png')
        },
        {
          title: '心理疏导',
          path: '/cbt-more',
          active: require('../assets/img/my/cbt1.png'),
          inactive: require('../assets/img/my/cbt.png')
        },
        {
          title: '测试',
          path: '/test-more',
          active: require('../assets/img/my/ce1.png'),
          inactive: require('../assets/img/my/ce.png')
        },
        {
          title: '我的',
          path: '/my-index',
          active: require('../assets/img/my/my1.png'),
          inactive: require('../assets/img/my/my.png')
        }
      ],
      active: ''
    }
  },
  methods: {
    // icon切换不同图片
    iconChange (active, item) {
      return active ? item.active : item.inactive
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
