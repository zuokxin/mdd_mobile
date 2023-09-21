<template>
  <div id="app">
    <keep-alive include="home">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 微信控制台，需要调试的时候可以开
export default {
  name: 'App',
  mounted () {
    // 控制Vcosole,使用cdn的方式
    const openVconsole = true
    const condition1 = window.location.hostname === 'depression.fubianmed.com'
    if (openVconsole && !condition1) {
      const vConsole = new window.VConsole()
      console.log(vConsole)
    }
    console.log(window.VConsole())
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
