<template>
  <div class="record">
    <div class="type">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.push('/my-index')"/>
        <span>心理疏导记录</span>
      </div>
      <div class="toggleType">
        <span :class="{active: type === 1}" @click="toggleType(1)">综合疏导</span>
        <span @click="toggleType(2)" :class="{active: type === 2}">专项疏导</span>
      </div>
    </div>
    <van-loading color="#1989fa" v-if="isloading"></van-loading>
    <div class="container" v-else ref="container">
      <div class="list" v-if="tableList.length > 0" :key="time" ref="list">
        <div class="card" v-for="item in tableList" :key="item.payTime">
          <div class="name">
            <span class="courseName">{{ item.courseName }}</span>
            <span class="tag" :class="getStatus(item.finishStatus).className">{{ getStatus(item.finishStatus).tag }}</span>
          </div>
          <div class="row">
            <span class="left">购买时间：</span>
            <span class="right">{{ dayjs(item.payTime * 1000).format('YYYY-MM-DD HH:mm') }}</span>
          </div>
          <div class="row" v-if="type === 1">
            <span class="left">想法：</span>
            <div class="right">
              <TextEllipsis :info="item.thought" :lineClamp="3" :hiddenBtn="true" v-if="item.finishStatus !== 1"></TextEllipsis>
              <span v-else>当前还没有想法，赶紧来疏导吧～</span>
            </div>
          </div>
          <div class="row tip" v-if="item.finishStatus === 1 || item.finishStatus === 2">
            <span>仅支持在App中疏导</span>
          </div>
        </div>
      </div>
      <div class="none" v-else>
        <div class="box">
          <img src="@/assets/img/my/nodata.png" alt="">
          <p>暂无疏导记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { userThemeCourseList, userCourseList } from '@/api/modules/user'
import TextEllipsis from '@/components/TextEllipsis.vue'
export default {
  name: 'record',
  components: {
    TextEllipsis
  },
  data () {
    return {
      type: 1,
      dayjs: dayjs,
      tableList: [],
      time: '',
      isloading: false
    }
  },
  mounted () {
    this.type = Number(this.$route.query.type) || 1
    this.disponseUrl()
    // this.listen()
    console.log('cbtcbt')
    console.log('windowheigth', window.height)
    console.log('heigth', document.body.offsetHeight)
    console.log('heigth1', document.getElementsByClassName('record')[0].clientHeight)
    console.log('getComputedStyle(document.documentElement).getPropertyValue("--vh")', 1, getComputedStyle(document.documentElement).getPropertyValue('--vh'), 2)
  },
  methods: {
    disponseUrl () {
      this.$router.replace(`/cbt-record?type=${this.type}`).catch(() => {})
      if (this.type === 1) {
        this.getCourseList()
      } else if (this.type === 2) {
        this.getThemeCourseList()
      }
    },
    toggleType (type) {
      console.log('type', type)
      if (type === this.type) return
      this.type = type
      this.disponseUrl()
    },
    async getCourseList () {
      this.time = new Date().getTime()
      this.isloading = true
      const res = await userCourseList()
      if (res.code === 0) {
        this.tableList = []
        this.tableList = res.data.courseList || []
        this.isloading = false
      }
      console.log('this.loading', this.loading, 'res', res)
      this.$nextTick(() => {
        this.$refs.container.scrollTop = 0
        console.log('container的height', this.$refs.container.clientHeight, 'this.$refs.container.scrollTop', this.$refs.container.scrollTop)
      })
    },
    async getThemeCourseList () {
      this.time = new Date().getTime()
      this.isloading = true
      const res = await userThemeCourseList()
      if (res.code === 0) {
        this.tableList = []
        this.tableList = res.data.courseList || []
        this.isloading = false
      }
      this.$nextTick(() => {
        this.$refs.container.scrollTop = 0
        console.log('container的height', this.$refs.container.clientHeight, 'this.$refs.container.scrollTop', this.$refs.container.scrollTop)
      })
    },
    getStatus (status) {
      if (status === 1) {
        return { tag: '未疏导', className: 'start' }
      } else if (status === 2) {
        return { tag: '疏导中', className: 'doing' }
      } else if (status === 3) {
        return { tag: '已疏导', className: 'completed' }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.van-loading {
  position: relative;
  color: #D5D5D5;
  font-size: 0;
  vertical-align: middle;
  width: 100%;
  height: calc(100 * var(--vh));
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0);
}
.record{
  height: calc(100 * var(--vh));
  background-color: #F6F6F7;
  overflow: hidden;
  flex-direction: column;
  .type{
    height:74rem/@w;
    background-color: #FFFFFF;
    box-sizing: border-box;
    padding: 0 20rem/@w;
    .title{
      position: relative;
      padding: 10rem/@w 0 16rem/@w ;
      font-size: 16rem/@w;
      line-height: 22rem/@w;
      font-weight: bold;
      color: #333;
      text-align: center;
      i{
        position: absolute;
        left: 0;
        font-size: 0.533333rem;
      }
    }
    .toggleType{
      box-sizing: border-box;
      padding: 0 45rem/@w;
      display: flex;
      justify-content: space-between;
      span{
        font-size: 14rem/@w;
        line-height: 20rem/@w;
        color: #333;
        margin-bottom: 4rem/@w;
        border-bottom: 2rem/@w solid transparent;
      }
      .active{
        color: #34B7B9;
        border-bottom: 2rem/@w solid #34b7b9;
      }
    }
  }
  .container {
    height: calc(100 * var(--vh) - 77rem/@w);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .list{
      width: 100%;
      box-sizing: border-box;
      padding:0 20rem/@w 16rem/@w;
      .card{
        margin-top: 16rem/@w;
        box-sizing: border-box;
        padding: 16rem/@w 20rem/@w;
        background-color: #fff;
        border-radius: 12rem/@w;
        .courseName{
          font-size: 14rem/@w;
          line-height: 20rem/@w;
          color: #333;
          font-weight: bold;
          margin-right: 5rem/@w;
        }
        .tag{
          display: inline-block;
          padding: 0 4rem/@w;
          border-radius: 5rem/@w;
          font-size: 12rem/@w;
          line-height: 17rem/@w;
          color: #fff;
        }
        .start{
          background-color: #b7b7b7;
        }
        .doing{
          background-color: #ffc31c;
        }
        .completed{
          background-color: #5ec565;
        }
        .row{
          margin-top: 8rem/@w;
          font-size: 12rem/@w;
          line-height: 18rem/@w;
          display: flex;
        }
        .left{
          color: #333;
        }
        .right{
          flex: 1;
          color: #666;
          position: relative;
          // .thought{
          //   // width: 100%;
          //   line-height: 18rem/@w;
          //   /* 设置为行高的整倍数，此处显示两行: 2 * 20rem/@w */
          //   max-height: 18rem/@w;
          // }
        }
        .tip{
          flex: 1;
          position: relative;
          height: 20rem/@w;
          font-size: 14rem/@w;
          line-height: 20rem/@w;
          color: #34B7B9;
          span{
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
    }
    .none{
      display: flex;
      justify-content: center;
      flex: 1;
      width: 100%;
      .box{
        margin-top: 140rem/@w;
        img{
          width: 140rem/@w;
          height: 140rem/@w;
        }
        p{
          margin: 0;
          color: #999999;
          font-size: 18rem/@w;
          line-height: 25rem/@w;
          text-align: center;
        }
      }
    }
  }
}
</style>
