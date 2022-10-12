<template>
  <div class="main">
    <van-nav-bar
      title="我的机构"
      left-arrow
      @click-left="onClickLeft"
    />
    <BindBatch :id="batchId" :number="userNumber" @bindSuccess="bindSuccess"></BindBatch>
    <div class="myBind">
      <h3>我的绑定</h3>
      <van-tabs type="card" v-model="active" @click="changeTab">
        <van-tab title="量表">
          <van-loading color="#1989fa" v-if="loading"/>
          <div class="bindist" v-else>
            <div class="noLogin" v-if="bindList.length === 0">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无绑定</span>
            </div>
            <div v-else>
              <div class="cardItem" v-for="item in bindList" :key="item.index">
                  <div class="name">
                    机构名称：{{item.organization.orgName}}
                  </div>
                  <div class="itemBox">
                    <span class="label">批次号：</span>
                    <span>{{item.batchId}}</span>
                  </div>
                  <div class="itemBox">
                    <span class="label">用户编号：</span>
                    <span>{{item.userNumber}}</span>
                  </div>
                  <div class="itemBox">
                    <span class="label">测试编号：</span>
                    <span>{{item.sessionId}}</span>
                  </div>
                  <div class="itemBox">
                    <span class="label">测试内容：</span>
                    <span>
                      <span v-for="(el, i) in item.evalRecords" :key="el.index">
                        {{el.table.tableName}}{{i === (item.evalRecords.length - 1) ? '' : '、'}}
                      </span>
                    </span>
                  </div>
                  <div v-if="item.evalRecords.length === 1 && !isCanDo(item.evalRecords)" class="btnBox">
                    <van-button v-if="item.status === 1" round type="info"
                      @click="startTest(item.sessionId, item.evalRecords, item.status)"
                    >开始测试</van-button>
                    <van-button v-else-if="item.status === 2" round  type="info"
                      @click="goOnTable(item.evalRecords[0].table.tableType, item.sessionId, item.evalRecords[0].table.tableCode)"
                    >继续测试</van-button>
                    <van-button v-else-if="item.status === 9" round plain type="info"
                    @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)"
                    >查看报告</van-button>
                  </div>
                  <div v-if="!isCanDo(item.evalRecords) && item.evalRecords.length > 1" class="btnBox">
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
                  <div v-if="isCanDo(item.evalRecords)" class="btnBox app">仅支持在APP中测试</div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="CBT疏导">
          <van-loading color="#1989fa" v-if="loading"/>
          <div class="bindist" v-else>
            <div class="noLogin" v-if="cbtList.length === 0">
              <img src="@/assets/img/my/nodata.png" alt="login">
              <span>暂无绑定</span>
            </div>
            <div v-else>
              <div class="cardItem" v-for="item in cbtList" :key="item.index">
                  <div class="name">
                    机构名称：{{item.orgName}}
                  </div>
                  <div class="itemBox">
                    <span class="label">批次号：</span>
                    <span>{{item.batchId}}</span>
                  </div>
                  <div class="itemBox">
                    <span class="label">用户编号：</span>
                    <span>{{item.userNumber}}</span>
                  </div>
                  <div class="itemBox">
                    <span class="label">测试内容：</span>
                    <span>{{item.courseName}}</span>
                  </div>
                  <div class="btnBox app">仅支持在APP中测试</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { organization, cbtCourse } from '@/api/modules/user'
import BindBatch from './bindBatch.vue'
import { findIndexByKeyValue } from '@/utils/checkFinish'
export default {
  beforeRouteEnter (to, from, next) {
    if (sessionStorage.getItem('phone')) {
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
    this.organization()
  },
  methods: {
    // 返回我的首页
    onClickLeft () {
      this.$router.push('/my-index')
    },
    // 获取机构测试记录
    async organization () {
      const { data } = await organization({ page: -1, pageSize: -1 })
      this.bindList = data.records || []
      this.loading = false
    },
    // 获取CBT测试记录
    async cbtCourse () {
      const { data } = await cbtCourse({ page: -1, pageSize: -1 })
      this.cbtList = data.courseList || []
      this.loading = false
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
    &:before{
      content: "";
      display: inline-block;
      width: 3px;
      height: 14rem / @w;
      background: #34B7B9;
      border-radius: 0px 11rem / @w 11rem / @w 0px;
      margin-right: 5rem / @w;
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
.cardItem{
  width: 311rem/@w;
  // height: 153rem/@w;
  background: #FFFFFF;
  border-radius: 10rem/@w;
  padding: 15rem/@w 12rem/@w;
  margin-bottom:  10rem/@w;
  .name{
    width: 298rem/@w;
    height: 20rem/@w;
    line-height: 20rem/@w;
    font-size: 16rem/@w;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 10rem/@w;
    border-bottom: 1px solid #F1F1F1;
    margin-bottom: 8rem/@w;
  }
  .itemBox{
    display: flex;
    justify-content: space-between;
    // align-items: center;
    min-height: 16rem/@w;
    font-size: 12rem/@w;
    color: #999999;
    margin-bottom: 5rem/@w;
    .label{
      white-space: nowrap;
      text-align: justify;
      text-align-last: justify;
      width: 60rem/@w;
    }
    span:last-child{
      text-align: right;
      word-break: break-all;
    }
  }
  .btnBox{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10rem/@w;
    .van-button--info{
      width: 72rem/@w;
      height: 28rem/@w;
      border-radius: 15rem/@w;
      font-size: 12rem/@w;
      padding: 0;
    }
  }
  .app{
    color: #34B7B9;
    font-size: .32rem;
  }
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
