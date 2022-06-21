<template>
<div>
  <van-nav-bar
      title="报告"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed>
    <template #right v-if="tableType == 2">
      <van-icon name="replay" size="18"/>
      <span>刷新</span>
    </template>
  </van-nav-bar>
  <iframe :src="src" frameborder="0"></iframe>
</div>
</template>

<script>
import wxShare from '@/utils/wxShare'
export default {
  data () {
    return {
      src: ''
    }
  },
  computed: {
    tableType () {
      return this.$route.query.tableType
    }
  },
  mounted () {
    // this.src = window.location.origin + '/user#/result?sessionId=' + this.$route.query.sessionId
    this.src = 'https://depression.local.fubianmed.com/user#/result?sessionId=' + this.$route.query.sessionId
    wxShare.hiddenShare()
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
iframe{
  width: 100%;
  height: calc(100vh - 1.226667rem);
  padding-top: 1.126667rem;
}

</style>
