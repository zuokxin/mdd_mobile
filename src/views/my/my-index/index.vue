<template>
  <div class="main">
    <div class="header">
      <img src="@/assets/img/my/touxiang.png" alt="touxiang">
      <!-- <div class="name" @click="login">
        <span v-if="!isLogin">点击登录</span>
        <span v-else>{{phone}}</span>
      </div> -->
      <div class="name">
        <div class="top"><span v-if="!isLogin" @click="login">点击登录</span><span v-else>{{phone}}</span> </div>
        <div class="center"><img src="../../../assets/img/yunyuicon.png" alt=""><span>云愈币 {{isLogin ?  yunyu_coins : '***'}}</span></div>
        <!-- scale -->
        <div class="under"><span class="round"><span>i</span> </span><span class="last"> <span>云愈币仅可在云愈心理APP中消费，暂不支持网页消费</span> </span></div>
      </div>
    </div>
    <div class="content">
      <div class="get-coins">
        <div class="top">签到领云愈币</div>
        <div class="center">
          <div class="blocks" v-for="(item,index) in signInData" :key="index">
            <div class="block-top"><span>{{myDays[index]}}</span></div>
            <div class="block-center"><img v-if="!item.isSignIn" :src="urlData[index]" alt=""> <img v-if="item.isSignIn" src="../../../assets/img/签到后.png" alt=""> </div>
            <div class="block-under"> <span :class="{'ed': item.isSignIn}">+{{item.coin}}</span> </div>
          </div>
        </div>
        <div class="under"><van-button round type="success" :class="{'van-ed': todayIsSignIn}" @click="signCoins">{{todayIsSignIn ? '今天已签到，明天继续' : '签到领云愈币'}}</van-button></div>
      </div>
      <div class="cardList">
        <div class="card" @click="$router.push('/my-infos').catch(() => {})">
          <img src="@/assets/img/my/info.png" alt="info">
          <div class="tip">个人信息</div>
        </div>
        <div class="card" @click="$router.push('/my-bind').catch(() => {})">
          <img src="@/assets/img/my/bind.png" alt="bind">
          <div class="tip">机构绑定</div>
        </div>
        <div class="card" @click="showKefu = true">
          <img src="@/assets/img/my/kefu.png" alt="kefu">
          <div class="tip">联系客服</div>
        </div>
        <div class="card" @click="skip">
          <img src="@/assets/img/my/app.png" alt="app">
          <div class="tip">下载APP</div>
        </div>
      </div>
      <div class="ceping">
        <van-tabs v-model="active" @click="changeTab">
          <van-tab title="我的测评">
            <div class="noLogin" v-if="!isLogin">
              <img src="@/assets/img/my/login.png" alt="login">
              <span>登录查看我的测评~</span>
            </div>
            <div class="noLogin" v-else-if="isLogin && noData">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无测评记录~</span>
            </div>
            <div class="tableList" ref="tableHeight" v-else-if="isLogin && !noData">
              <div v-for="(item, index) in tableList" :key="item.index" :class="{'tableCard': showStyle(item.evalRecords), 'more': !showStyle(item.evalRecords) }">
                <div class="cardBox" v-if="showStyle(item.evalRecords)" ref="textContainer">
                  <img :src="item.evalRecords[0].table.tableLogo" alt="tableLogo">
                  <div class="msg">
                    <div class="name">{{item.evalRecords[0].table.tableName}}</div>
                    <div class="time">
                      <span>{{moment(item.paidAt * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                      <span>￥{{item.price}}</span>
                    </div>
                  </div>
                  <van-button v-if="item.status === 1" round type="info"
                    @click="startTest(item.sessionId, item.evalRecords, item.status)"
                  >开始测试</van-button>
                  <van-button v-else-if="item.status === 2" round plain type="info"
                    @click="goOnTable(item.evalRecords[0].table.tableType, item.sessionId, item.evalRecords[0].table.tableCode)"
                  >继续测试</van-button>
                  <van-button v-else-if="item.status === 9" round plain type="info"
                  @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)"
                  >查看报告</van-button>
                </div>
                <div class="moreBox" v-else>
                  <div class="top">
                    <span
                    :style="{'max-height': item.textOpenFlag ? textHeight : ''}"
                    :class="{hiddenText: item.textOpenFlag}"
                    class="textMore"
                    ref="textContainer"
                    >{{moreListName[index].join('、')}}</span>
                    <span
                    v-if="item.textOpenFlag !== null"
                    @click="item.textOpenFlag = !item.textOpenFlag"
                    class="btnMore"
                    >{{item.textOpenFlag ? '【展开】':'【收起】'}}</span>
                  </div>
                  <div class="bottom">
                    <div class="time moreTime">
                      <span>{{moment(item.paidAt * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                      <span>￥{{item.price}}</span>
                    </div>
                    <div v-if="!isCanDo(item.evalRecords)" class="btnBox">
                      <van-button v-if="item.status === 1" round type="info"
                        @click="startTest(item.sessionId, item.evalRecords, item.status)"
                      >开始测试</van-button>
                      <van-button v-if="item.status === 2" round  type="info"
                        @click="startTest(item.sessionId, item.evalRecords, item.status)"
                      >继续测试</van-button>
                      <van-button v-if="item.status === 9 || hasFinish(item.evalRecords)" round plain type="info"
                      @click="readReport(item.sessionId, second(item.evalRecords) ? 2 : 1)"
                      style="margin-left: 10px">查看报告</van-button>
                    </div>
                    <div v-if="isCanDo(item.evalRecords)" class="app">仅支持在APP中测试</div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="收藏">
            <div class="noLogin" v-if="!isLogin">
              <img src="@/assets/img/my/login.png" alt="login">
              <span>登录查看我的收藏~</span>
            </div>
            <div class="noLogin" v-else-if="isLogin && noCollect">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无收藏~</span>
            </div>
            <div class="tableList" ref="tableHeight" v-else-if="isLogin && !noCollect">
              <div class="tableCard cllect" v-for="item in collectList" :key="item.index"
              @click="$router.push({ path: '/test-detail', query:{ tableCode: item.tableCode } })">
                <div class="cardBox">
                  <img :src="item.tableLogo" alt="tableLogo">
                  <div class="msg">
                    <div class="name clollectName">{{item.tableName}}</div>
                    <div class="clollectName intros">{{item.tableIntroduction}}</div>
                    <div class="time">
                      <span>￥{{item.price}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <div style="height:50px"><MainTabbar></MainTabbar></div>
    <van-dialog v-model="showKefu" :showConfirmButton="false">
      <div class="close" @click="showKefu = false"><img  src="@/assets/img/my/close.png" alt="close"></div>
      <h4>联系微信</h4>
      <div class="wx"><img  src="@/assets/img/my/wx.png" alt="wx"></div>
      <h4>客服电话</h4>
      <div class="phone">
        <img  src="@/assets/img/my/phone.png" alt="phone">
        <span @click="phoneClick('0512-6856-5993')">0512-6856-5993</span>
      </div>
    </van-dialog>
    <div class="popout" v-if="showCoins">
    <div class="popout_box">
      <p>恭喜获得{{reward}}云愈币</p>
      <div class="btn">
        <van-button round type="success" @click="refreshshowCoins">明日继续</van-button>
      </div>
    </div>
    </div>
    <NewPersonGift :flag="newPersonFlag" type="main" @reloadCoins="reloadCoins" />
  </div>
</template>

<script>
import { getIndividual, getCollect, signInFind, signInCreate } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'
import MainTabbar from '@/components/MainTabbar'
import NewPersonGift from '@/components/newPerson'
import moment from 'moment'
import { findIndexByKeyValue } from '@/utils/checkFinish'
export default {
  data () {
    return {
      moment: moment,
      active: 0,
      isLogin: false,
      noData: true,
      noCollect: true,
      showKefu: false,
      phone: '',
      tableList: [],
      collectList: [],
      moreList: [],
      moreListName: [],
      textOpenFlag: false, // 展开收起
      textHeight: '', // 文本高度
      myDays: ['第一天', '第二天', '第三天', '第四天', '第五天', '第六天', '第七天'],
      signInData: [
        {
          isSignIn: false,
          coin: 0.2
        },
        {
          isSignIn: false,
          coin: 0.2
        },
        {
          isSignIn: false,
          coin: 0.36
        },
        {
          isSignIn: false,
          coin: 0.2
        },
        {
          isSignIn: false,
          coin: 0.2
        },
        {
          isSignIn: false,
          coin: 0.2
        },
        {
          isSignIn: false,
          coin: 0.56
        }
      ],
      urlData: [
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin1.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin1.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin2.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin1.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin1.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin1.png',
        'https://oss-fubian-yunyu.fubianmed.com/banner/coin2.png'
      ],
      todayIsSignIn: false,
      showCoins: false,
      reward: '',
      yunyu_coins: '',
      newPersonFlag: false
    }
  },
  components: {
    MainTabbar,
    NewPersonGift
  },
  computed: {
    // 判断能否在H5做量表
    isCanDo () {
      return (arr) => {
        const flag = arr.some(v => {
          if (v.table.tableType === 2) {
            return v.tableCode !== 'hamd' && v.tableCode !== 'hama'
          } else {
            return v.tableCode === 'psqi'
          }
        })
        return flag
      }
    },
    // 判断多个量表中是否有已经完成的量表
    hasFinish () {
      return (arr) => {
        const flag = arr.some(v => {
          return v.finishedAt !== 0
        })
        return flag
      }
    },
    // 判断多个量表中是否有他评量表
    second () {
      return (arr) => {
        const flag = arr.some(v => {
          return v.table.tableType === 2
        })
        // console.log(flag, this.configTables)
        return flag
      }
    },
    // 判断显示样式
    showStyle () {
      return (arr) => {
        if (arr.length === 1 && arr[0].tableCode !== 'psqi') {
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted () {
    this.phone = sessionStorage.getItem('phone')
    if (this.phone) {
      this.getTableList()
      this.getCoins()
      this.$store.dispatch('getInfo').then(res => {
        this.yunyu_coins = res.data.yunyu_coins
        if (res.data.isNewUser && !res.data.isRxNUReward) {
          this.newPersonFlag = true
        }
      })
    } else {
      this.isLogin = false
    }
    wxShare.share()
  },
  methods: {
    async getTableList () {
      this.isLogin = true
      const res = await getIndividual({ page: -1, pageSize: -1 })
      const records = res.data.records
      if (records) {
        this.noData = false
        this.tableList = records
        this.tableList.forEach(v => {
          const arr = []
          v.evalRecords.forEach(el => {
            arr.push(el.table.tableName)
          })
          this.moreListName.push(arr)
        })
        this.tableList.forEach((ele, index) => {
          if (ele.evalRecords.length > 1) {
            this.$set(
              this.tableList,
              index,
              Object.assign({}, ele, { textOpenFlag: null })
            )
          }
        })
        this.$nextTick(() => {
          if (this.tableList.length > 0) {
            this.showTextAll()
          }
          // const contentHeight = document.querySelector('.content').clientHeight
          // const tableHeight = contentHeight - 172
          // const tableHeight = 186
          // const tableDom = this.$refs.tableHeight
          // tableDom.style.height = tableHeight + 'px'
        })
        // console.log(this.tableList, this.moreListName)
      } else {
        this.noData = true
      }
    },
    // 签到
    async getCoins () {
      const res = await signInFind()
      if (res.code === 0) {
        this.todayIsSignIn = res.data.todayIsSignIn
        this.signInData = res.data.signInData
      }
    },
    // 点了新人有礼刷新币
    reloadCoins () {
      // 刷新云愈币
      this.newPersonFlag = false
      this.publicUse()
    },
    refreshshowCoins () {
      this.showCoins = false
      this.publicUse()
    },
    publicUse () {
      this.$store.dispatch('getInfo').then(res => {
        this.yunyu_coins = res.data.yunyu_coins
      })
    },
    // 签到的逻辑
    signCoins () {
      if (!this.isLogin) {
        this.login()
      } else {
        if (this.todayIsSignIn) {
        } else {
          signInCreate().then(res => {
            if (res.code === 0) {
              this.reward = res.data.reward
              this.showCoins = true
              this.getCoins()
            }
          })
        }
      }
    },
    async getCollection () {
      const res = await getCollect()
      const tables = res.data
      if (tables && tables.length > 0) {
        this.noCollect = false
        this.collectList = tables
        this.$nextTick(() => {
          const contentHeight = document.querySelector('.content').clientHeight
          const tableHeight = contentHeight - 172
          const tableDom = this.$refs.tableHeight
          tableDom.style.height = tableHeight + 'px'
        })
      } else {
        this.noCollect = true
      }
    },
    showTextAll () {
      // 这是默认两行数据的高度，一行的高度可以自定义 可以*3 *4达到三行或者四行显示展示和收起的效果
      const twoHeight = 20 * 2
      this.textHeight = `${twoHeight}px`
      const txtDom = this.$refs.textContainer
      for (let i = 0; i < txtDom.length; i++) {
        const curHeight = txtDom[i].offsetHeight
        if (curHeight > twoHeight) {
          this.$set(
            this.tableList,
            i,
            Object.assign({}, this.tableList[i], { textOpenFlag: true })
          )
        } else {
          this.$set(
            this.tableList,
            i,
            Object.assign({}, this.tableList[i], { textOpenFlag: null })
          )
        }
      }
    },
    changeTab (e) {
      if (this.phone) {
        if (e === 0) {
          this.getTableList()
        } else {
          this.getCollection()
        }
      } else {
        this.isLogin = false
      }
    },
    login () {
      if (!this.isLogin) {
        this.$router.push({
          path: '/login',
          query: {
            url: this.$route.path
          }
        })
      }
    },
    // 拨打手机号
    phoneClick (phoneNum) {
      window.location.href = 'tel:' + phoneNum
    },
    // 单个量表开始测试 & 多个量表开始和继续测试
    startTest (sessionId, tables, status) {
      if (sessionStorage.tables) {
        sessionStorage.removeItem('tables')
      }
      sessionStorage.setItem('tables', JSON.stringify(tables))
      const tablesList = JSON.parse(sessionStorage.tables) || []
      const currentIndex = findIndexByKeyValue(tablesList, 'finishedAt', 0)
      if (status === 1) {
        this.$router.push({ path: '/test-do-infos', query: { sessionId, tableCode: tablesList[0].tableCode, tableType: tablesList[0].table.tableType } })
      } else {
        if (tablesList[currentIndex].table.tableType === 1) {
          this.$router.replace({ path: '/test-do-self', query: { sessionId: sessionId, tableCode: tablesList[currentIndex].tableCode } })
        } else {
          this.$router.replace({ path: '/environment', query: { sessionId: sessionId, tableCode: tablesList[currentIndex].tableCode } })
        }
      }
    },
    // 单个量表继续测试
    goOnTable (type, sessionId, tableCode) {
      if (sessionStorage.tables) {
        sessionStorage.removeItem('tables')
      }
      if (type === 1) {
        this.$router.push({ path: '/test-do-self', query: { sessionId, tableCode } })
      } else {
        this.$router.push({ path: '/environment', query: { sessionId, tableCode } })
      }
    },
    // 查看报告
    readReport (sessionId, tableType) {
      this.$router.push({ path: '/test-report', query: { sessionId, tableType } })
    },
    // 联系客服
    skip () {
      this.$router.push('/my-contact')
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100vh;
  overflow: hidden;
  .header{
    height: 2.053333rem;
    display: flex;
    padding: .266667rem  .533333rem;
    img{
      width: 1.6rem;
      height: 1.6rem;
    }
    .name{
      margin-left: .4rem;
      height: 1.6rem;
      font-size: .426667rem;
      font-weight: 600;
      color: #333333;
      .top{
        height: .5946rem;
        margin-bottom: .0541rem;
        span{
          color: #333333;
          font-weight: 500;
        }
      }
      .center{
        border-radius: .3784rem;
        display: inline-block;
        background: rgba(52,183,185,0.15);
        height: .7568rem;
        padding: .1081rem .3243rem;
        box-sizing: border-box;
        img{
          width: .5135rem;
          height: .5135rem;
        }
        span{
          font-size: 14px;
          color: #333333;
          font-weight: 500;
          vertical-align: top;
          padding-left: .1622rem;
        }
      }
      .under{
        height: .3784rem;
        display: flex;
        margin-top: 2px;
        span{
          display: inline-block;
        }
        .round{
          width: .3243rem;
          height: .3243rem;
          border-radius: 50%;
          background: #34B7B9;
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            font-size: 12px;
            scale: 0.83;
            color: #FFFFFF;
            text-align: center;
          }
        }
        .last{
          padding-left: 2px;
          span{
            width: 10rem;
            display: block;
            font-size: 12px;
            color: #333333;
            transform: scale(0.83);
            transform-origin: left top;
            font-weight: 400;
          }
        }
      }
    }
  }
  .content{
    background-color: #F6F6F7;
    padding: .48rem .533333rem;
    height: inherit;
    overflow: hidden;
    .get-coins{
      position: relative;
      height: 5.7027rem;
      padding: .4324rem .2703rem;
      border-radius: .3243rem;
      background: #7ECECE;
      margin-bottom: .4324rem;
      box-sizing: border-box;
      .top{
        font-size: 14px;
        color: #FFFFFF;
        font-weight: 500;
        margin-bottom: .2703rem;
      }
      .center{
        display: flex;
        justify-content: space-around;
        .blocks{
          width: 1.0811rem;
          height: 2.027rem;
          font-size: 10px;
          border-radius: .2162rem;
          padding: .1622rem .1351rem;
          background: #FFFFFF;
          overflow: hidden;
          box-sizing: border-box;
          .block-top{
            width: 100%;
            display: flex;
            height: .3784rem;
            justify-content: center;
            margin-bottom: .1081rem;
            span{
              display: inline-block;
              font-size: 20px;
              transform: scale(0.5);
              word-break: keep-all;
              color: #666666;
            }
          }
          .block-center{
            text-align: center;
            img{
              width: .8108rem;
              height: .8108rem;
            }
          }
          .block-under{
            height: .3243rem;
            display: flex;
            justify-content: center;
            align-items: top;
            span{
              display: inline-block;
              color: #F19F38;
              font-size: .2703rem;
              transform: scale(0.83);
            }
            .ed{
              color: #999999;
            }
          }
        }
      }
      .under{
        position: absolute;
        bottom: .4865rem;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .van-ed{
          background: #D5D5D5 !important;
          color: #FFFFFF !important;
        }
        .van-button{
          width: 8.3784rem;
          height: 1.3514rem;
          border: none;
          background: #FFFFFF;
          font-size: 16px;
          color: #333333;
          font-weight: 500;
        }
      }
    }
    .cardList{
      height: 2.213333rem;
      background: #FFFFFF;
      border-radius: .266667rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .card{
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
          width: .8rem;
          height: .8rem;
        }
        .tip{
          font-size: .373333rem;
          color: #333333;
        }
      }
    }
    .ceping{
      .noLogin{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 4.266667rem !important;
        img{
          width: 3.733333rem;
          height: 3.733333rem;
        }
        span{
          font-size: .48rem;
          color: #999999;
          margin-top: -.533333rem;
        }
      }
      .tableList{
        overflow-y: auto;
        // height: 5.027rem;
        // height: 500px;
      }
      .tableCard{
        .cardBox{
          width: 8.4rem;
          height: 1.813333rem;
          padding: .266667rem;
          background: #FFFFFF;
          border-radius: .266667rem;
          display: flex;
          align-items: center;
          margin-bottom: .266667rem;
          justify-content: space-between;
          img{
            width: 1.813333rem;
            height: 1.813333rem;
          }
          .msg{
            width: 4.4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: .266667rem;
            height: 100%;
            .name{
              font-size: .373333rem;;
              color: #333333;
            }
            .clollectName{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .intros{
              font-size: 12rem / @w;
              color: #666;
            }
          }
          .van-button{
            width: 1.866667rem;
            height: .746667rem;
            font-size: .32rem;
            padding: 0;
            line-height: .746667rem;
            text-align: center;
          }
        }
      }
      .cllect{
        justify-content: flex-start;
        .msg{
          flex: 1;
        }
      }
    }
  }
  .time{
    font-size: .32rem;
    color: #666;
    span:nth-child(2){
      margin-left: .266667rem;
    }
  }
  .more{
    .moreBox{
      width: 8.4rem;
      background: #FFFFFF;
      border-radius: .266667rem;
      padding: .4rem .266667rem;
      margin-bottom: .266667rem;
      .top{
        font-size: .373333rem;
        color: #333333;
        position: relative;
        .hiddenText {
          overflow: hidden;
          display: block;
        }
        .hiddenText:after {
          z-index: 3;
          content: "...";
          position: absolute;
          bottom: 2px;
          right: 1.28rem;
          width: .533333rem;
          padding-left: .48rem;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.1), #fff 45%);
        }
        .btnMore{
          color: #34B7B9;
          position: absolute;
          right: 0;
          bottom: 0;
          background-color: #fff;
        }
      }
      .bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        .moreTime{
          display: flex;
          flex-direction: column;
          span:nth-child(2){
            margin-left:0;
          }
        }
        .app{
          color: #34B7B9;
          font-size: .32rem;
        }
        .btnBox{
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .van-button--info{
            width: 72rem/@w;
            height: 28rem/@w;
            border-radius: 15rem/@w;
            font-size: 12rem/@w;
            padding: 0;
          }
        }
      }
    }
  }
  .van-dialog{
    width: 7.786667rem;
    height: 6.48rem;
    background: #FFFFFF;
    border-radius: .533333rem;
    padding: .426667rem;
    .close{
      display: flex;
      justify-content: flex-end;
      img{
        width: .373333rem;
        height: .373333rem;
      }
    }
    h4{
      font-size: .373333rem;
      font-weight: 600;
      color: #333333;
      margin: 0;
      margin-bottom: .266667rem;
      text-align: center;
    }
    .wx{
      display: flex;
      justify-content:center;
      margin-bottom: .426667rem;
      img{
        width: 3.2rem;
        height: 3.2rem;
      }
    }
    .phone{
      display: flex;
      justify-content:center;
      align-items: center;
      img{
        width: .293333rem;
        height: .293333rem;
      }
      span{
        color: #34B7B9;
        font-size: .373333rem;
        margin-left: 5px;
      }
    }
  }
  .popout{
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .popout_box{
      width: 8.7568rem;
      height: 6.5676rem;
      border-radius: .5405rem;
      background-color: #FFFFFF;
      position: relative;
      p{
        margin-top: 1.7027rem;
        font-size: .4324rem;
        color: #000000;
        font-weight: 600;
        text-align: center;
      }
      .btn{
        position: absolute;
        bottom: 1.0811rem;
        width: 100%;
        text-align: center;
        .van-button{
          border: none;
          background: #34B7B9;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>

<style lang="less">
.ceping{
   .van-tabs--line .van-tabs__wrap{
      height: .8rem;
      margin-top: .48rem;
      margin-bottom: .266667rem;
      .van-tabs__nav{
        background: transparent;
      }
      .van-tab{
        font-size: .373333rem;
        font-weight: 600;
        color: #000000;
        margin-right: .8rem;
        flex: inherit;
        padding: 0;
      }
      .van-tabs__line{
        background-color:#34B7B9;
      }
  }
}
</style>
