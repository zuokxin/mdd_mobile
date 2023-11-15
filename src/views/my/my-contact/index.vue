<template>
  <div class="main">
    <van-nav-bar title="下载App" left-arrow @click-left="onClickLeft" fixed />
    <div class="box">
      <iframe id="mainIframe" name="mainIframe" width="100%" :src="`${url}/share/?type=YWJvdXQ=`" frameborder="0"
        scrolling="auto"></iframe>
    </div>
  </div>
</template>

<script>
import browser from '@/utils/browser'
export default {
  data () {
    return {
      url: '',
      ios: browser().ios
    }
  },
  mounted () {
    this.$store.dispatch('addShare', {}, () => {
      console.log('联系页面加载分享')
    })
    const adress = window.location.origin.split('//')[1].split('.')[0]
    this.appSource()
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
    },
    appSource () {
      const boxWidth = document.querySelector('.box')
      if (this.ios) {
        boxWidth.style.width = '100%'
      } else {
        boxWidth.style.width = '102%'
      }
    }

  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: calc(100 * var(--vh));
  overflow: hidden;
  position: relative;
}

.main::-webkit-scrollbar {
  display: none;
}

.box {
  position: absolute;
  left: 0;
  top: 1.226667rem;
  width: 102%;
  height: calc(100 * var(--vh) - 1.126667rem);
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  overflow-x: hidden;
}

#mainIframe {
  overflow-x: hidden;
}
</style>
