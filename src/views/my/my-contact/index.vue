<template>
  <div class="main">
    <van-nav-bar
      title="下载APP"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
  <div class="box">
    <iframe id="mainIframe" name="mainIframe" width="102%" :src=" `${url}/share/?type=YWJvdXQ=`" frameborder="0" scrolling="auto" ></iframe>
  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    const adress = window.location.origin.split('//')[1].split('.')[0]
    console.log(adress)
    if (adress === '10' || adress.includes('localhost')) {
      this.url = 'https://depression.fubianmed.com'
    } else {
      this.url = window.location.origin
    }
    this.changeMobsfIframe()
    window.onresize = function () {
      this.changeMobsfIframe()
    }
  },
  methods: {
    changeMobsfIframe () {
      /**
      * iframe-宽高自适应显示
      *
      */
      const mobsf = document.getElementById('mainIframe')
      mobsf.height = window.innerHeight - 46
      // mobsf.style.height = (Number(deviceHeight) - 45) + 'px' // 数字是页面布局高度差
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.box{
  position: absolute;
  left: 0;
  top: 1.226667rem;
  width: 100%;
}
#mainIframe {
  overflow-x: hidden;
}
</style>
