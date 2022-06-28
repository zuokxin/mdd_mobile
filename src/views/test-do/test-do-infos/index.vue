<template>
  <div class="container">
    <div class="main">
      <!-- --------------------------- -->
      <div class="title">姓名</div>
      <div class="row">
        <van-field v-model="info.name" placholder="请输入" @blur="checkName" />
      </div>
      <!-- --------------------------- -->
      <div class="title">性别</div>
      <div class="row" @click="sheetShow('genderShow')">
        <span class="has" v-if="info.gender">{{info.gender}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
      <van-action-sheet v-model="genderShow" :actions="genderList" cancel-text="取消" close-on-click-action @select="haveSameSelect($event, 'gender', 'genderShow')" />
      <!-- --------------------------- -->
      <div class="title">出生年月</div>
      <div class="row" @click="sheetShow('birthShow')">
        <span class="has" v-if="info.birthday">{{info.birthday}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
       <van-action-sheet  v-model="birthShow">
        <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        @confirm="disposeTime"
        @cancel="birthShow = false"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        />
      </van-action-sheet>
      <!-- --------------------------- -->
      <div class="title">教育程度</div>
      <div class="row"  @click="eduShow = true">
        <span class="has" v-if="info.education">{{info.education}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
      <van-action-sheet v-model="eduShow" :actions="eduList" cancel-text="取消" close-on-click-action @select="haveSameSelect($event, 'education', 'eduShow')" />
      <!-- --------------------------- -->
      <div class="title">婚姻状况</div>
      <div class="row" @click="sheetShow('marShow')">
        <span class="has" v-if="info.maritalStatus">{{info.maritalStatus}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
      <van-action-sheet v-model="marShow" :actions="marList" cancel-text="取消" close-on-click-action @select="haveSameSelect($event, 'maritalStatus', 'marShow')" />
      <!-- --------------------------- -->
      <div class="title">口味喜好</div>
      <div class="row" @click="sheetShow('tasteShow')">
        <span class="has" v-if="info.preferableTaste">{{info.preferableTaste}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
      <van-action-sheet v-model="tasteShow" :actions="tasteList" cancel-text="取消" close-on-click-action @select="haveSameSelect($event, 'preferableTaste', 'tasteShow')" />
      <!-- --------------------------- -->
      <div class="title">颜色喜好</div>
      <div class="row" @click="sheetShow('colorShow')">
        <span class="has" v-if="info.preferableColor">{{info.preferableColor}}</span>
        <span class="tip" v-else>请选择</span>
        <van-icon name="arrow-down"/>
      </div>
      <van-action-sheet v-model="colorShow" :actions="colorList" cancel-text="取消" close-on-click-action @select="haveSameSelect($event, 'preferableColor', 'colorShow')" />
      <!-- -------------- -->
      <p class="first-p">本测试中您的个人信息仅做报告区分</p>
      <p class="last-p">不作任何其他用途</p>
      <div class="sure-btn">
        <van-button round type="info" @click="sure">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCreate, userCreate } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'
export default {
  name: 'my-info',
  data () {
    return {
      sessionId: '',
      info: {},
      tableCode: '',
      nameShow: false,
      genderShow: false,
      genderList: [{ name: '男' }, { name: '女' }],
      birthShow: false,
      currentDate: new Date(),
      maxDate: new Date(),
      minDate1: new Date(),
      eduShow: false,
      eduList: [{ name: '文盲' }, { name: '小学' }, { name: '初中' }, { name: '高中' }, { name: '中专' }, { name: '大专' }, { name: '本科' }, { name: '研究生' }],
      marShow: false,
      marList: [{ name: '未婚' }, { name: '已婚' }, { name: '离异' }, { name: '丧偶' }, { name: '分居' }],
      tasteShow: false,
      tasteList: [{ name: '酸' }, { name: '甜' }, { name: '苦' }, { name: '辣' }, { name: '咸' }, { name: '不确定' }],
      colorShow: false,
      colorList: [{ name: '绿' }, { name: '红' }, { name: '黄' }, { name: '白' }, { name: '蓝' }, { name: '不确定' }]
    }
  },
  computed: {
    minDate () {
      const date = new Date()
      const d = date.getFullYear() - 100
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      return new Date(d, m, 1)
    },
    configTables () {
      return sessionStorage.tables ? JSON.parse(sessionStorage.tables) : []
    }
  },
  mounted () {
    this.sessionId = this.$route.query.sessionId
    this.tableCode = this.$route.query.tableCode
    if (this.$store.getters.isLogin(sessionStorage.getItem('phone'))) {
      this.init()
    } else {
      this.$router.replace('/login')
    }
    wxShare.hiddenShare()
  },
  methods: {
    async init () {
      const res = await getUserCreate({ sessionId: this.sessionId })
      if (res.code === 0) {
        this.info = res.data.info
        delete this.info.identifier
      }
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    // 选择了 关闭弹窗
    haveSameSelect (e, k, flag) {
      this.info[k] = e.name
      this[flag] = false
    },
    // 处理时间
    disposeTime () {
      const d = new Date(this.currentDate)
      const datetime = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1)
      this.haveSameSelect({ name: datetime }, 'birthday', 'birthShow')
    },
    // 不同的弹窗
    sheetShow (flag) {
      this[flag] = true
    },
    // 检查名字
    checkName () {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (this.info.name.length > 25) {
        this.$toast('姓名过长，请重新输入')
      } else if (!reg.test(this.info.name)) {
        this.$toast('支持输入中文、英文')
      }
    },
    // 下一步去做题
    sure () {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (!this.info.name) {
        this.$toast('请输入姓名')
      } else if (!this.info.gender) {
        this.$toast('请选择性别')
      } else if (!this.info.birthday) {
        this.$toast('请选择出生年月')
      } else if (!this.info.education) {
        this.$toast('请选择教育程度')
      } else if (!this.info.maritalStatus) {
        this.$toast('请选择婚姻状况')
      } else if (!this.info.preferableTaste) {
        this.$toast('请选择口味喜好')
      } else if (!this.info.preferableColor) {
        this.$toast('请选择颜色喜好')
      } else if (this.info.name.length > 25) {
        this.$toast('姓名过长，请重新输入')
      } else if (!reg.test(this.info.name)) {
        this.$toast('支持输入中文、英文')
      } else {
        userCreate({ sessionId: this.sessionId, info: this.info }).then(res => {
          if (res.code === 0) {
            // this.$router.replace({ path: `/test-do-${this.$route.query.type}`, query: { sessionId: this.sessionId, tableCode: this.tableCode } })
            // 1 自评
            if (this.configTables.length) {
              if (this.configTables[0].table.tableType === 1) {
                this.$router.replace({ path: '/test-do-self', query: { sessionId: this.sessionId, tableCode: this.configTables[0].tableCode } })
              } else {
                this.$router.replace({ path: '/environment', query: { sessionId: this.sessionId, tableCode: this.configTables[0].tableCode } })
              }
            } else {
              if (this.$route.query.tableType === '1') {
                this.$router.replace({ path: '/test-do-self', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
              }
              // 2 他评
              if (this.$route.query.tableType === '2') {
                this.$router.replace({ path: '/environment', query: { sessionId: this.sessionId, tableCode: this.tableCode } })
              }
            }
          } else {
            this.$toast(res.message)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/style/reset-vant.less';
.container{
  .main{
    padding: .8rem;
    .title{
      color: #333333;
      font-size: .373333rem;
      margin-bottom: .16rem;
      font-weight: 500;
    }
    .row{
      border-radius: .32rem;
      overflow: hidden;
      height: 1.28rem;
      background-color: #F6F6F6;
      display: flex;
      padding: 0px .426667rem;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .48rem;
      .van-field{
        background-color: #F6F6F6;
        padding-left: 0;
      }
      span{
        font-size: .373333rem;
      }
      .has{
        color: #333333;
      }
      .tip{
        color: #D5D5D5;
      }
      .van-icon-arrow-down:before{
        color: #666666;
        font-size: .373333rem;
      }
    }
    p{
      text-align: center;
      color: #999999;
      margin: 0;
      font-size: .32rem;
    }
    .first-p{
      padding-top: .373333rem;
    }
    .last-p{
      margin-bottom: 5rem;
    }
    .sure-btn{
      position: fixed;
      bottom: .533333rem;
      z-index: 999;
      width: 100%;
      .van-button{
        background-color: @green;
        border-radius: .666667rem;
        margin: 0 .373333rem;
        box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
        width: 7.68rem;
        height: 1.333333rem;
        border-color: @green;
      }
    }
  }
}
</style>
