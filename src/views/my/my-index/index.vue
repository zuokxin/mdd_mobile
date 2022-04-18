<template>
  <div class="main">
    <div class="header">
      <img src="@/assets/img/my/touxiang.png" alt="touxiang">
      <div class="name" @click="login">
        <span v-if="!isLogin">点击登录</span>
        <span v-else>{{phone}}</span>
      </div>
    </div>
    <div class="content">
      <div class="cardList">
        <div class="card" @click="$router.push('/my-infos').catch(() => {})">
          <img src="@/assets/img/my/info.png" alt="info">
          <div class="tip">个人信息</div>
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
              <div class="tableCard" v-for="item in tableList" :key="item.index">
                <img :src="item.evalRecords[0].table.tableLogo" alt="tableLogo">
                <div class="msg">
                  <div class="name">{{item.evalRecords[0].table.tableName}}</div>
                  <div class="time">
                    <span>{{moment(item.paidAt * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    <span>￥{{item.price}}</span>
                  </div>
                </div>
                <van-button v-if="item.status === 1" round type="info"
                  @click="$router.push({ path: '/test-do-infos', query:{ sessionId: item.sessionId, tableCode: item.evalRecords[0].table.tableCode } })"
                >开始测试</van-button>
                <van-button v-else-if="item.status === 2" round plain type="info"
                  @click="$router.push({ path: '/test-do-self', query:{ sessionId: item.sessionId, tableCode: item.evalRecords[0].table.tableCode} })"
                >继续测试</van-button>
                <van-button v-else-if="item.status === 9" round plain type="info"
                @click="readReport(item.sessionId)"
                >查看报告</van-button>
              </div>
              <div class="more" v-for="(item, index) in moreList" :key="item.index">
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
                  <div class="time">
                    <span>{{moment(item.paidAt * 1000).format('YYYY-MM-DD HH:mm')}}</span>
                    <span>￥{{item.price}}</span>
                  </div>
                  <div class="app">仅支持在APP中测试</div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="收藏">
            <div class="noLogin" v-if="!isLogin">
              <img src="@/assets/img/my/login.png" alt="login">
              <span>登录查看我的收藏~</span>
            </div>
            <div class="noLogin" v-else-if="isLogin && noData">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无收藏~</span>
            </div>
            <div class="tableList" ref="tableHeight" v-else-if="isLogin && !noData">
              <div class="tableCard cllect" v-for="item in collectList" :key="item.index"
              @click="$router.push({ path: '/test-detail', query:{ tableCode: item.tableCode } })">
                <img :src="item.tableLogo" alt="tableLogo">
                <div class="msg">
                  <div class="name">{{item.tableName}}</div>
                  <div class="time">
                    <span>￥{{item.price}}</span>
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
  </div>
</template>

<script>
import { getIndividual, getCollect } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'
import MainTabbar from '@/components/MainTabbar'
import moment from 'moment'
export default {
  data () {
    return {
      moment: moment,
      active: 0,
      isLogin: false,
      noData: true,
      showKefu: false,
      phone: '',
      tableList: [],
      collectList: [],
      moreList: [],
      moreListName: [],
      textOpenFlag: false, // 展开收起
      textHeight: '' // 文本高度
    }
  },
  components: {
    MainTabbar
  },
  mounted () {
    this.phone = sessionStorage.getItem('phone')
    if (this.phone) {
      this.getTableList()
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
        const oneList = records.filter(v => v.evalRecords.length === 1 && (v.evalRecords[0].tableCode !== 'psqi' && v.evalRecords[0].table.tableType !== 2))
        const status1 = oneList.filter(v => v.status === 1 || v.status === 2)
        const status9 = oneList.filter(v => v.status === 9)
        this.tableList = [...status1, ...status9]
        this.moreList = records.filter(v => v.evalRecords.length > 1 || v.evalRecords[0].tableCode === 'psqi' || v.evalRecords[0].table.tableType === 2)
        this.moreList.forEach(v => {
          if (v.evalRecords.length > 1) {
            const arr = []
            v.evalRecords.forEach(el => {
              arr.push(el.table.tableName)
            })
            this.moreListName.push(arr)
          } else {
            this.moreListName.push([v.evalRecords[0].table.tableName])
          }
        })
        // console.log(this.tableList, this.moreList, this.moreListName)
        this.moreList.forEach((ele, index) => {
          this.$set(
            this.moreList,
            index,
            Object.assign({}, ele, { textOpenFlag: null })
          )
        })
        this.$nextTick(() => {
          if (this.moreList.length > 0) {
            this.showTextAll()
          }
          const contentHeight = document.querySelector('.content').clientHeight
          const tableHeight = contentHeight - 172
          const tableDom = this.$refs.tableHeight
          tableDom.style.height = tableHeight + 'px'
        })
      } else {
        this.noData = true
      }
    },
    async getCollection () {
      const res = await getCollect()
      const tables = res.data
      if (tables) {
        this.noData = false
        this.collectList = tables
        this.$nextTick(() => {
          const contentHeight = document.querySelector('.content').clientHeight
          const tableHeight = contentHeight - 172
          const tableDom = this.$refs.tableHeight
          tableDom.style.height = tableHeight + 'px'
        })
      } else {
        this.noData = true
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
            this.moreList,
            i,
            Object.assign({}, this.moreList[i], { textOpenFlag: true })
          )
        } else {
          this.$set(
            this.moreList,
            i,
            Object.assign({}, this.moreList[i], { textOpenFlag: null })
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
    phoneClick (phoneNum) {
      window.location.href = 'tel:' + phoneNum
    },
    skip () {
      this.$router.push('/my-contact')
    },
    readReport (sessionId) {
      window.open(`/user/#/result?sessionId=${sessionId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
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
      display: flex;
      align-items: center;
      font-size: .426667rem;
      font-weight: 600;
      color: #333333;
    }
  }
  .content{
    background-color: #F6F6F7;
    padding: .48rem .533333rem;
    height: inherit;
    overflow: hidden;
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
        // height: 500px;
      }
      .tableCard{
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
      .app{
        color: #34B7B9;
        font-size: .32rem;
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
