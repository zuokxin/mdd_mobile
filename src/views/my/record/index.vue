<template>
  <div class="record">
    <div class="type">
      <van-icon name="arrow-left" @click="$router.push('/my-index')"/>
      <div class="toggleType"> <span :class="{active: type === 2}" @click="toggleType(1)">个人测试</span> <span @click="toggleType(2)" :class="{active: type === 1}">机构测试</span> </div>
    </div>
    <div class="statusList">
      <div class="box" @click="selectStatus('1,2,9')" v-if="type === 1" :class="{actived: status === '1,2,9'}"> <div class="text">全部</div> <div class="line"></div> </div>
      <div class="box" @click="selectStatus('0,1,2,9')" v-if="type === 2" :class="{actived: status === '0,1,2,9'}"> <div class="text">全部</div> <div class="line"></div> </div>
      <div class="box" @click="selectStatus('1,2')" :class="{actived: status === '1,2'}"> <div class="text" >未完成</div> <div class="line"></div> </div>
      <div class="box" @click="selectStatus('9')" :class="{actived: status === '9'}"> <div class="text" >已完成</div> <div class="line"></div> </div>
    </div>
    <div class="list" v-if="(records.length > 0)" :key="time">
      <div class="card" v-for="(item,index) in records" :key="index">
        <div class="test-id" v-if="type === 1"><div class="left"><span>测试编号:</span>{{item.sessionId}}</div><div class="right">共{{item.evalRecords.length}}件</div></div>
        <div class="test-id" v-if="type === 2"><div class="left">{{item.organization && item.organization.orgName}}</div><div class="right">共{{item.evalRecords.length}}件</div></div>
        <div class="blocks" v-for="(it,ind) in turnArray(item.step)" :key="item.evalRecords[ind].table.tableName" :class="{'block-under-line':(item.evalRecords.length <= 3 && ind + 1 === item.step)}">
          <div class="name">{{item.evalRecords[ind].table.tableName}}</div>
          <div class="introduction"  v-if="item.evalRecords[ind].table.tableIntroduction"><span>{{item.evalRecords[ind].table.tableIntroduction}}</span></div>
        </div>
        <div class="more-list" v-if="(item.evalRecords.length > 3)">
          <div class="add" v-if="(item.step < item.evalRecords.length)" @click="item.step = item.evalRecords.length">查看更多<van-icon name="arrow-down" color="#4D4D4D"/></div>
          <div class="reduce" v-if="(item.step === item.evalRecords.length)" @click="item.step = 3">收起<van-icon name="arrow-up" color="#4D4D4D"/></div>
        </div>
        <div class="buy-infos" v-if="type === 1">
          <div class="left"><span>购买时间: {{DateFormat({date: item.paidAt * 1000, format: 'yyyy-MM-dd hh:mm'})}}</span></div>
          <div class="right">¥ {{item.price}}</div>
        </div>
        <div class="buy-infos" v-if="type === 2">
          <div class="left"><span>批次号: {{item.batchId.length > 15 ? item.batchId.substring(0, 15) + '...': item.batchId}}</span></div>
          <div class="right" v-if="item.payee === 'user'">¥ {{item.price.toFixed(2)}}</div>
        </div>
        <div class="buy-infos" v-if="type === 2">
          <div class="left"><span>用户编号: {{item.userNumber.length > 15 ? item.userNumber.substring(0, 15) + '...': item.userNumber}}</span></div>
        </div>
        <div class="buy-infos" v-if="type === 2 && item.finishedAt > 0">
          <div class="left"><span>完成时间: {{DateFormat({date: item.finishedAt * 1000, format: 'yyyy-MM-dd hh:mm'})}}</span></div>
        </div>
        <div class="function-btns">
          <div class="normal-function">
            <van-button v-if="(item.status === 0)" round plain type="info" @click="pay(item)">支付</van-button>
            <van-button v-if="item.status === 1" round plain type="info" @click="startTest(item.sessionId, item.evalRecords, item.status, item.reportDisplayEnabled)">开始测试</van-button>
            <van-button v-if="item.status === 2 " round plain type="info" @click="goOnTable(item.evalRecords, item.sessionId, item.reportDisplayEnabled)">继续测试</van-button>
            <van-button v-if="item.status === 9 && item.reportDisplayEnabled" round class="van-button-dark" plain type="info" @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)">查看报告</van-button>
            <van-button v-if="item.status === 2 && item.evalRecords[0].finishedAt > 0 && item.reportDisplayEnabled" round class="van-button-dark" plain type="info" @click="readReport(item.sessionId, item.evalRecords[0].table.tableType)">查看报告</van-button>
          </div>
        </div>
      </div>
    </div>
    <div class="none" v-else>
      <div class="box">
        <img src="@/assets/img/my/nodata.png" alt="">
        <p>暂无记录</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/utils/date'
import { getIndividual, getOrganization } from '@/api/modules/user'

export default {
  name: 'record',
  data () {
    return {
      DateFormat: DateFormat,
      type: 0,
      time: '',
      status: '', // 1未完成 2全部 9已完成
      records: []
    }
  },
  mounted () {
    this.type = Number(this.$route.query.type) || 1
    this.disponseUrl()
  },
  methods: {
    disponseUrl () {
      this.$router.replace(`/my-record?type=${this.type}`).catch(() => {})
      if (this.type === 1) {
        this.status = '1,2,9'
        this.getList()
      } else if (this.type === 2) {
        this.status = '0,1,2,9'
        this.getBatchList()
      }
    },
    getList () {
      getIndividual({ page: -1, pageSize: -1, status: this.status }).then(res => {
        if (res.code === 0) {
          this.time = new Date().getTime()
          this.records = []
          if (res.data.records) {
            this.records = res.data.records.map(e => {
              return {
                ...e,
                step: e.evalRecords.length >= 3 ? 3 : e.evalRecords.length
              }
            })
          }
        }
      })
    },
    getBatchList () {
      getOrganization({ page: -1, pageSize: -1, status: this.status }).then(res => {
        if (res.code === 0) {
          this.time = new Date().getTime()
          this.records = []
          if (res.data.records) {
            this.records = res.data.records.map(e => {
              return {
                ...e,
                step: e.evalRecords.length >= 3 ? 3 : e.evalRecords.length
              }
            })
          }
        }
      })
    },
    toggleType (type) {
      if (type === this.type) return
      this.type = type
      this.disponseUrl()
      if (this.type === 1) {
        if (this.status !== '1,2' && this.status !== '9') {
          this.status = '1,2,9'
        }
        this.getList()
      } else if (this.type === 2) {
        if (this.status !== '1,2' && this.status !== '9') {
          this.status = '0,1,2,9'
        }
        this.getBatchList()
      }
    },
    selectStatus (status) {
      this.status = status
      if (this.type === 1) {
        if (this.status !== '1,2' && this.status !== '9') {
          this.status = '1,2,9'
        }
        this.getList()
      } else if (this.type === 2) {
        if (this.status !== '1,2' && this.status !== '9') {
          this.status = '0,1,2,9'
        }
        this.getBatchList()
      }
    },
    turnArray (target) {
      const arr = []
      for (let i = 0; i < target; i++) {
        arr.push(i)
      }
      return arr
    },
    // 开始测试
    startTest (sessionId, tables, status, reportDisplayEnabled) {
      // sessionStorage.reportDisplayEnabled = 'true'
      sessionStorage.reportDisplayEnabled = reportDisplayEnabled
      if (this.type === 2) {
        sessionStorage.setMark = 'jigoupay'
      } else {
        sessionStorage.setMark = 'gerenpay'
      }
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
    // 继续测试
    goOnTable (tables, sessionId, reportDisplayEnabled) {
      // sessionStorage.reportDisplayEnabled = 'true'
      sessionStorage.reportDisplayEnabled = reportDisplayEnabled
      if (this.type === 2) {
        sessionStorage.setMark = 'jigoupay'
      } else {
        sessionStorage.setMark = 'gerenpay'
      }
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
    pay (item) {
      if (this.type === 2) {
        sessionStorage.setItem('backType', 2)
      }
      this.$router.push(`/order-detail?batchId=${item.batchId}&sessionId=${item.sessionId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.record{
  height: 100vh;
  background-color: #F6F6F7;
  overflow: hidden;
  .type{
    height: 1.0667rem;
    padding: .2133rem 0;
    background-color: #FFFFFF;
    position: relative;
    box-sizing: border-box;
    i{
      position: absolute;
      left: .5333rem;
      top: .2133rem;
      font-size: 0.533333rem;
    }
    .toggleType{
      margin: auto;
      width: 3.7333rem;
      height: .64rem;
      border-radius: .32rem;
      border: 1px solid #34B7B9;
      background: #34B7B9;
      display: flex;
      overflow: hidden;
      span{
        flex: 1;
        line-height: .64rem;
        text-align: center;
        color: #FFFFFF;
      }
      .active{
        color: #34B7B9;
        background: #FFFFFF;
      }
    }
  }
  .statusList{
    display: flex;
    justify-content: center;
    height: .9867rem;
    padding-top: .2133rem;
    box-sizing: border-box;
    background-color: #FFFFFF;
    .actived{
      .text{
        color: #34B7B9 !important;
      }
      .line{
        background-color: #34B7B9 !important;
      }
    }
    .box{
      margin: 0 .5333rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text{
        height: .4533rem;
        line-height: .4533rem;
        color: #333333;
        font-size: .32rem;
        font-weight: 500;
      }
      .line{
        width: .2667rem;
        height: .0533rem;
        background-color: #FFFFFF;
      }
    }
  }
  .list{
    padding: .2667rem .5333rem  4.2667rem .5333rem;
    overflow-y: scroll;
    box-sizing: border-box;
    height: 100%;
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
      .blocks{
        margin-bottom: .2667rem;
        .name{
          color: #333333;
          font-size: .3733rem;
          line-height: .5333rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: 700;
          height: .5333rem;
          margin-bottom: .0533rem;
        }
        .introduction{
          height: .4533rem;
          line-height: .4533rem;
          font-size: .32rem;
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
        .normal-function{
          text-align: right;
          .van-button{
            // width: 2.1867rem;
            height: .7733rem;
            border: 1px solid #34B7B9;
            margin-left: .16rem;
          }
          .van-button__content{
            font-size: .3733rem;
            white-space:nowrap;
          }
          .van-button-dark{
            color: #333333;
            border: 1px solid #D5D5D5;
          }
        }
      }
    }
  }
  .none{
    display: flex;
    padding-top: 5.8667rem;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    .box{
      width: 3.7333rem;
      height: 3.7333rem;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      p{
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 0;
        color: #999999;
        font-size: .48rem;
        margin: 0;
      }
    }
  }
}
</style>
