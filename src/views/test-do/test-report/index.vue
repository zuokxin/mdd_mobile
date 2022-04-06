<template>
<div>
  <iframe :src="src" frameborder="0"></iframe>
</div>
</template>

<script>
export default {
  data () {
    return {
      src: ''
    }
  },
  mounted () {
    this.src = window.location.origin + '/user#/result?sessionId=' + this.$route.query.sessionId
  }
}
</script>

<style lang="less" scoped>
iframe{
  width: 100%;
  height: 100vh;
}

</style>
