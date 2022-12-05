<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  margin: 0 auto;
  max-width: 750px;
  min-height: 100vh;
}
</style>
