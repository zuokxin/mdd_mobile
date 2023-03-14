<template>
  <div class="main">
    <van-nav-bar
      title="机构绑定"
      left-arrow
      @click-left="onClickLeft"
    />
    <BindBatch :id="batchId" :number="userNumber" @bindSuccess="bindSuccess"></BindBatch>
    <div class="myBind">
      <h3> <img src="@/assets/img/my/titlepng.png" alt=""> 我的绑定</h3>
      <van-tabs type="card" v-model="active" @click="changeTab">
        <van-tab title="量表">
          <van-loading color="#1989fa" v-if="loading"/>
          <div class="bindist" v-else>
            <div class="noLogin" v-if="bindList.length === 0">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无绑定</span>
            </div>
            <div v-else>
              <div class="list"  :key="new Date().getTime()">
                <div class="card" v-for="(item,index) in bindList" :key="index">
                  <div class="test-id"><div class="left">{{item.organization.orgName}}</div><div class="right">共{{item.evalRecords.length}}件</div></div>
                  <div class="blocks" v-for="(it,ind) in turnArray(item.step)" :key="ind" :class="{'block-under-line':(item.evalRecords.length <= 3 && ind + 1 === item.step)}">
                    <div class="name">{{item.evalRecords[ind].table.tableName}}</div>
                    <div class="introduction" v-if="item.evalRecords[ind].table.tableIntroduction"><span >{{item.evalRecords[ind].table.tableIntroduction}}</span></div>
                  </div>
                  <div class="more-list" v-if="(item.evalRecords.length > 3)">
                    <div class="add" v-if="(item.step < item.evalRecords.length)" @click="select = 'close',item.step = item.evalRecords.length">查看更多<van-icon name="arrow-down" color="#4D4D4D"/></div>
                    <div class="reduce" v-if="(item.step === item.evalRecords.length)" @click="select = 'close',item.step = 3">收起<van-icon name="arrow-up" color="#4D4D4D"/></div>
                  </div>
                  <div class="buy-infos">
                    <div class="left"><span>批次号: {{item.batchId.length > 15 ? item.batchId.substring(0, 15) + '...': item.batchId}}</span></div>
                    <div class="right" v-if="item.payee === 'user'">¥ {{item.price.toFixed(2)}}</div>
                  </div>
                  <div class="buy-infos">
                    <div class="left"><span>用户编号: {{item.userNumber.length > 15 ? item.userNumber.substring(0, 15) + '...': item.userNumber}}</span></div>
                  </div>
                  <div class="buy-infos" v-if="item.finishedAt > 0">
                    <div class="left"><span>完成时间: {{DateFormat({date: item.finishedAt * 1000, format: 'yyyy-MM-dd hh:mm'})}}</span></div>
                  </div>
                  <div class="function-btns">
                    <div class="psqi" v-if="item.status === 1 && isCanDo(item.evalRecords)">
                      仅支持在APP中测试
                    </div>
                    <div class="normal-function" v-else>
                      <van-button v-if="(item.status === 0)" round plain type="info" @click="pay(item)">支付</van-button>
                      <van-button v-if="(item.status === 1) && !isCanDo(item.evalRecords)" round plain type="info" @click="startTest(item.sessionId, item.evalRecords, item.status, item.reportDisplayEnabled)">开始测试</van-button>
                      <!-- <van-button v-else-if="item.status === 2" round plain type="info" @click="goOnTable(item.evalRecords[0].table.tableType, item.sessionId, item.evalRecords[0].table.tableCode)">继续测试</van-button> -->
                      <van-button v-if="item.status === 2 && !isCanDo(item.evalRecords)" round plain type="info" @click="goOnTable(item.evalRecords, item.sessionId, item.reportDisplayEnabled)">继续测试</van-button>
                      <van-button v-if="item.status === 9 && item.reportDisplayEnabled" round class="van-button-dark" plain type="info" @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)">查看报告</van-button>
                      <van-button v-if="item.status === 2 && item.evalRecords[0].finishedAt > 0 && item.reportDisplayEnabled" round class="van-button-dark" plain type="info" @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)">查看报告</van-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="心理疏导">
          <van-loading color="#1989fa" v-if="loading"/>
          <div class="bindist bindist-cbt" v-else>
            <div class="noLogin" v-if="cbtList.length === 0">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无绑定</span>
            </div>
            <div v-else>
              <div class="card" v-for="(item,index) in cbtList" :key="index">
                  <div class="test-id"><div class="left">{{item.orgName.length > 15 ? item.orgName.substring(0, 15) + '...': item.orgName}}</div><div class="right">共1件</div></div>
                  <div class="blocks"><div class="name">{{item.courseName}}</div>
                  <div class="buy-infos"><div class="left"><span>批次号: {{item.batchId.length > 15 ? item.batchId.substring(0, 15) + '...': item.batchId}}</span></div></div>
                  <div class="buy-infos"><div class="left"><span>用户编号: {{item.userNumber.length > 15 ? item.userNumber.substring(0, 15) + '...': item.userNumber}}</span></div></div>
                  <div class="function-btns"><div class="psqi">仅支持在APP中测试</div></div>
              </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/date'

import { organization, cbtCourse } from '@/api/modules/user'
import BindBatch from './bindBatch.vue'
export default {
  beforeRouteEnter (to, from, next) {
    if (localStorage.getItem('phone')) {
      next()
    } else {
      next(vm => {
        vm.$router.push({
          path: '/login',
          query: {
            url: '/my-bind'
          }
        })
      })
    }
  },
  data () {
    return {
      DateFormat: DateFormat,
      batchId: '',
      userNumber: '',
      bindList: [],
      flagT: false,
      loading: true,
      active: 0,
      cbtList: []
    }
  },
  components: {
    BindBatch
  },
  computed: {
    // 判断能否在H5做量表
    isCanDo () {
      return (arr) => {
        const flag = arr.some(v => {
          return v.tableCode === 'psqi'
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
    }
  },
  mounted () {
    // 路由重定向后不再执行下去
    if (!localStorage.getItem('phone')) return
    this.organization()
  },
  methods: {
    // 返回我的首页
    onClickLeft () {
      // this.$router.push('/my-index')
      // 从哪里来返回到哪里
      this.$router.back()
    },
    // 获取机构测试记录
    organization () {
      organization({ page: -1, pageSize: -1 }).then(res => {
        if (res.code === 0) {
          this.bindList = []
          if (res.data.records) {
            this.bindList = res.data.records.map(e => {
              return {
                ...e,
                step: e.evalRecords.length >= 3 ? 3 : e.evalRecords.length
              }
            })
          }
        }
      })
      this.loading = false
    },
    // 获取CBT测试记录
    async cbtCourse () {
      const { data } = await cbtCourse({ page: -1, pageSize: -1 })
      this.cbtList = data.courseList || []
      this.loading = false
    },
    turnArray (target) {
      const arr = []
      for (let i = 0; i < target; i++) {
        arr.push(i)
      }
      return arr
    },
    // 绑定机构成功
    bindSuccess (type) {
      if (type === 'table') {
        this.active = 0
        this.organization()
      } else {
        this.active = 1
        this.cbtCourse()
      }
    },
    changeTab (e) {
      this.loading = true
      if (e === 0) {
        this.organization()
      } else {
        this.cbtCourse()
      }
    },
    // 单个量表开始测试 & 多个量表开始和继续测试
    startTest (sessionId, tables, status, reportDisplayEnabled) {
      sessionStorage.reportDisplayEnabled = reportDisplayEnabled
      sessionStorage.setItem('backPath', 'bind')
      if (sessionStorage.tables) {
        sessionStorage.removeItem('tables')
      }
      sessionStorage.setItem('tables', JSON.stringify(tables))
      const tablesList = JSON.parse(sessionStorage.tables) || []
      if (status === 1) {
        this.$router.push({ path: '/test-do-infos', query: { sessionId, tableCode: tablesList[0].tableCode, tableType: tablesList[0].table.tableType } })
      } else {
        this.$router.push({ path: '/test-do-start', query: { sessionId, tableCode: tablesList[0].tableCode, tableType: tablesList[0].table.tableType } })
      }
    },
    // 单个量表继续测试
    goOnTable (tables, sessionId, reportDisplayEnabled) {
      sessionStorage.reportDisplayEnabled = reportDisplayEnabled
      sessionStorage.setItem('backPath', 'bind')
      const item = tables.find(e => {
        return e.finishedAt === 0
      })
      const userSelect = []
      tables.forEach(e => {
        if (e.finishedAt === 0) {
          userSelect.push({ table: e.table, tableType: e.table.tableType, tableCode: e.table.tableCode })
        }
      })
      sessionStorage.setItem('tables', JSON.stringify(userSelect))
      // console.log(userSelect)
      const tableCode = item.table.tableCode
      const type = item.table.tableType
      this.$router.push({ path: '/test-do-start', query: { sessionId, tableCode, tableType: type } })
    },
    // 查看报告
    readReport (sessionId, tableType) {
      this.$router.push({ path: '/test-report', query: { sessionId, tableType } })
    },
    // 支付去
    pay (item) {
      sessionStorage.setItem('backPath', 'bind')
      this.$router.push(`/order-detail?batchId=${item.batchId}&sessionId=${item.sessionId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.main{
  background: #F6F6F6;
  min-height: 100vh;
  width: 100%;
  h3{
    height: 20rem / @w;
    display: flex;
    align-items: center;
    font-size: 14rem / @w;
    font-weight: 500;
    color: #333333;
    margin: 0;
    margin-bottom: 14rem/@w;
    img{
      position: relative;
      top: -3rem /@w;
      width: 3rem /@w;
      height: 14rem /@w;
      margin-right: 5rem/@w;
    }
  }
  .myBind{
    padding: 5rem/@w 20rem/@w  18rem/@w;
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
  }
}
.card{
  padding: .48rem .5333rem;
  background: #FFFFFF;
  border-radius: .2667rem;
  margin-bottom: 10px;
  .test-id{
    color: #666666;
    font-size: .32rem;
    height: .4533rem;
    line-height: .4533rem;
    padding-bottom: .16rem;
    display: flex;
    border-bottom: 1px solid #F6F6F6;
    margin-bottom: .2667rem;
    .left{
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-right: 2em;
      span{
        color: #333333;
      }
    }
    .right{
      white-space: nowrap;
    }
  }
  .line{
    padding-bottom: .2667rem;
    border-bottom: 1px solid #F6F6F6 ;
  }
  .blocks{
    margin-bottom: .2667rem;
    .name{
      color: #333333;
      font-size: .3733rem;
      line-height: .5333rem;
      font-weight: 700;
      height: .5333rem;
      margin-bottom: .0533rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .introduction{
      height: .4533rem;
      line-height: .4533rem;
      font-size: .32rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      span{
        color: #666666;
      }
    }
  }
  .block-under-line{
    border-bottom: 1px solid #F6F6F6 ;
    padding-bottom: 0.2133rem;
  }
  .more-list{
    padding-top: .2667rem;
    border-top: 1px solid #F6F6F6 ;
    color: #666666;
    text-align: center;
    i{
      padding-left: .16rem;
    }
    .add{
      margin-bottom: .2133rem;
      font-size: .32rem;
      height: 17px;
      line-height: .4533rem;
    }
    .reduce{
      margin-bottom: .2133rem;
      font-size: .32rem;
      height: 17px;
      line-height: .4533rem;
    }
  }
  .buy-infos{
    display: flex;
    justify-content: space-between;
    color: #666666;
    height: .4533rem;
    font-size: .32rem;
    line-height: .4533rem;
    margin-bottom: .32rem;
    .left{
      color: #333333;
    }
  }
  .function-btns{
    .psqi{
      text-align: right;
      color: #34B7B8;
    }
    .normal-function{
      text-align: right;
      .van-button{
        width: 2.1867rem;
        height: .7733rem;
        border: 1px solid #34B7B9;
        margin-left: .16rem;
      }
      .van-button__content{
        font-size: .3733rem;
        white-space: nowrap;
      }
      .van-button-dark{
        color: #333333;
        border: 1px solid #D5D5D5;
      }
    }
  }
}
.bindist-cbt{
  .blocks{
    .name{
      padding-bottom: .2667rem;
      margin-bottom: .2667rem;
      border-bottom: 1px solid #F6F6F6;
    }
  }
}
.list{
  padding: .2667rem .0rem  4.2667rem;
  overflow-y: auto;
  box-sizing: border-box;
  height: 100%;
}
.van-loading {
  position: relative;
  color: #D5D5D5;
  width: 100%;
  height: 200rem/@w;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0);
}
/deep/.van-tabs__wrap{
  height: 28px;
  margin: 10px  0;
  .van-tabs__nav--card{
    border: 0;
    height: 28px;
    border-radius: 0;
    margin:0;
    background: transparent;
    .van-tab{
      width: 72px;
      height: 28px;
      border: 0;
      color: #666;
      font-size: 12px;
      font-weight: normal;
      flex: inherit;
    }
    .van-tab--active{
      width: 72px;
      height: 28px;
      background: #34B7B9;
      border-radius: 114px;
      color: #fff;
    }
  }
}
</style>
