<template>
  <div class="main">
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="onClickLeft"
    />
    <div>
      <van-cell  is-link title="姓名" :value="form.name" @click="showInput = true" />
      <van-cell  is-link title="性别" :value="form.gender" @click="showSex = true" />
      <van-cell  is-link title="出生年月" :value="form.birthday" @click="showBirth = true" />
      <van-cell  is-link title="教育程度" :value="form.education" @click="showEducate = true" />
      <van-cell  is-link title="婚姻状况" :value="form.maritalStatus" @click="showMarry = true" />
      <van-cell  is-link title="口味喜好" :value="form.preferableTaste" @click="showTaste = true" />
      <van-cell  is-link title="颜色喜好" :value="form.preferableColor" @click="showColor = true" />
      <van-popup v-model="showBirth" position="bottom">
        <van-datetime-picker
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          v-model="currentDate"
          @confirm="onConfirm"
          @cancel="showBirth = false"
        />
      </van-popup>
      <van-dialog v-model="showInput" :showConfirmButton="false">
        <van-field v-model="name" placeholder="请输入姓名" />
        <van-button round type="info" @click="sure">确定</van-button>
      </van-dialog>
      <van-action-sheet v-model="showSex" :actions="sexArr" cancel-text="取消" close-on-click-action @select="onSelectSex" />
      <van-action-sheet v-model="showEducate" :actions="educateArr" cancel-text="取消" close-on-click-action @select="onSelectEducate" />
      <van-action-sheet v-model="showMarry" :actions="marriageArr" cancel-text="取消" close-on-click-action @select="onSelectMarry" />
      <van-action-sheet v-model="showTaste" :actions="tasteArr" cancel-text="取消" close-on-click-action @select="onSelectTaste" />
      <van-action-sheet v-model="showColor" :actions="colorArr" cancel-text="取消" close-on-click-action @select="onSelectColor" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { sexArr, educateArr, marriageArr, tasteArr, colorArr } from './dataSelect'
import { getUserInfo, updateInfo } from '@/api/modules/user'
export default {
  data () {
    return {
      form: {
        name: '',
        gender: '',
        birthday: '',
        education: '',
        maritalStatus: '',
        preferableTaste: '',
        preferableColor: ''
      },
      showInput: false, // 姓名
      name: '',
      showSex: false, // 性别
      sexArr: sexArr,
      showBirth: false, // 出生年月
      currentDate: new Date(),
      maxDate: new Date(),
      showEducate: false, // 教育程度
      educateArr: educateArr,
      showMarry: false, // 婚姻状况
      marriageArr: marriageArr,
      showTaste: false, // 口味喜好
      tasteArr: tasteArr,
      showColor: false, // 颜色喜好
      colorArr: colorArr
    }
  },
  computed: {
    minDate () {
      const date = new Date()
      const y = date.getFullYear() - 100
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 0) : (date.getMonth() + 0)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return new Date(y, m, d)
    }
  },
  mounted () {
    // const minTime = new Date().setTime(new Date().getTime() - 1000 * 3600 * 24 * 365 * 100)
    // this.minDate = new Date(minTime)
    // this.maxDate = new Date()
    this.getInfo()
    // wxShare.share(false)
    this.$store.dispatch('addShare', {}, () => {
      console.log('个人信息页加载分享')
    })
  },
  methods: {
    async getInfo () {
      const res = await getUserInfo()
      if (res.code === 0) {
        Object.assign(this.form, res.data)
        if (this.form.birthday) {
          this.currentDate = new Date(this.form.birthday)
        } else {
          this.currentDate = new Date()
        }
        this.name = this.form.name
      }
    },
    async postInfo () {
      const res = await updateInfo(this.form)
      if (res.code === 0) { }
    },
    sure () {
      var l = this.name.length
      var blen = 0
      for (var i = 0; i < l; i++) {
        if ((this.name.charCodeAt(i) & 0xff00) !== 0) {
          blen++
        }
        blen++
      }
      const reg = /^[\u4e00-\u9fa5a-zA-Z·]+$/
      if (!reg.test(this.name)) {
        this.$toast('支持输入中文、英文或 ·')
      } else if (blen > 25) {
        this.$toast('姓名过长，请重新输入')
      } else {
        this.form.name = this.name
        this.showInput = false
        this.postInfo()
      }
    },
    onSelectSex (item) {
      this.form.gender = item.name
      this.postInfo()
    },
    onSelectEducate (item) {
      this.form.education = item.name
      this.postInfo()
    },
    onSelectMarry (item) {
      this.form.maritalStatus = item.name
      this.postInfo()
    },
    onSelectTaste (item) {
      this.form.preferableTaste = item.name
      this.postInfo()
    },
    onSelectColor (item) {
      this.form.preferableColor = item.name
      this.postInfo()
    },
    onConfirm (date) {
      this.showBirth = false
      this.form.birthday = moment(date).format('YYYY-MM-DD')
      this.postInfo()
    },
    onClickLeft () {
      this.$router.push('/my-index')
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  .van-hairline--bottom::after{
    border-bottom: 1px solid #D5D5D5;
  }
  .van-action-sheet__item:not(:last-child){
    border-bottom: 1px solid #efefef;
  }
  .van-cell{
    padding: .426667rem .533333rem;
    color: #333;
    font-size: .426667rem;
    .van-cell__value{
      color: #999;
      font-size: .373333rem;
    }
    .van-cell__right-icon{
      color: #666;
    }
  }
  .van-dialog{
    width: 7.04rem;
    height: 4.88rem;
    background: #FFFFFF;
    border-radius: .533333rem;
    padding: .8rem;
    .van-cell{
        padding: .266667rem .426667rem;
        font-size: .373333rem;
        width: 7.04rem;
        height: 2.133333rem;
        background: #F6F6F6;
        opacity: 1;
        border-radius: .266667rem;
    }
  }
  .van-button--info{
    width: 2.293333rem;
    height: 1.066667rem;
    line-height: 1.066667rem;
    background: #34B7B9;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    margin-left: 50%;
    margin-top: 1.28rem;
    transform: translateX(-50%);
    border-radius: .533333rem;
    padding: 0;
    font-size: .426667rem;
  }

}

</style>
