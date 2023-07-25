<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
// 微信控制台，需要调试的时候可以开
import Vconsole from 'vconsole'
export default {
  name: 'App',
  mounted () {
    const vConsole = new Vconsole()
    console.log(vConsole)
  }
}
</script>

<style lang="less">
*:focus-visible {
  outline: none;
}
#app {
  margin: 0 auto;
  max-width: 750px;
  min-height: 100vh;
}
</style>
