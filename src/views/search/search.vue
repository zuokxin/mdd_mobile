<template>
  <div class="search">
    <div class="search-head">
      <div class="bg">
        <div class="left"><img src="@/assets/img/my/search.png" alt=""></div>
        <div class="center">
          <form action="javascript:return true">
            <input @keyup.13="search(keyWord)" ref="myInput" type="search" v-model="keyWord" />
          </form>
        </div>
        <div class="right" v-show="keyWord" @click="clear"><img src="@/assets/img/my/clear.png" alt=""></div></div>
      <span @click="$router.push('/test-more')">取消</span>
    </div>
    <div class="everyone same-style"  v-if="!searched">
      <div class="everyone-title">大家都在搜</div>
      <div class="container">
        <div class="block" @click="search('抑郁')">抑郁</div>
        <div class="block" @click="search('焦虑')">焦虑</div>
        <div class="block" @click="search('SCL-90')">SCL-90</div>
        <div class="block" @click="search('MBTI')">MBTI</div>
        <div class="block" @click="search('睡眠')">睡眠</div>
        <div class="block" @click="search('社交')">社交</div>
      </div>
    </div>
    <div class="history same-style" v-if="historyList.length > 0 && !searched">
      <div class="history-title"><span>历史搜索</span> <span @click="popout = true"><img src="../../assets/img/my/delete.png" alt=""></span></div>
      <div class="container">
        <div class="block" @click="search(it)" v-for="(it,index) in historyList" :key="index">{{it}}</div>
      </div>
    </div>
    <div class="searched" v-if="searched && (list && list.length >0)">
      <div class="title">测试</div>
      <div class="card">
        <div class="card-block" v-for="(it,index) in list" :key="index" @click="$router.push({ path: '/test-detail', query:{ tableCode: it.tableCode } })">
        <div class="left"> <img :src="it.tableLogo" alt=""></div>
        <div class="right">
          <div class="name">{{it.tableName}}</div>
          <div class="intr">{{it.tableIntroduction}}</div>
          <div class="price">
            <div class="price-left">￥ {{it.price}}</div>
            <div class="price-right"><img src="@/assets/img/my/fire.png" alt="">{{it.evalRecordCount}}人已测试</div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="none-list" v-if="searched && (list && list.length <= 0)"><img src="../../assets/img/my/none-list.png" alt=""> <div class="text">暂无搜索结果</div></div>
    <div class="popout" v-if="popout">
      <div class="popout_box">
        <div class="popout_body">
          <div class="text">确定删除全部历史记录？</div>
          <div class="btns">
            <van-button type="default" size="small" class="cancel" @click="popout = false" >取消</van-button>
            <van-button type="primary" size="small" class="sure" @click="onConfirm">确认</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchTable } from '@/api/modules/table'

export default {
  name: 'search',
  data () {
    return {
      keyWord: '',
      list: [],
      historyList: [],
      popout: false,
      searched: false,
      filterArr: ['psqi', 'FADI']
    }
  },
  mounted () {
    this.disponse()
    this.$refs.myInput.focus()
  },
  methods: {
    disponse () {
      const str = JSON.parse(localStorage.getItem('knames'))
      if (str !== null && str !== '') {
        let arr = str.split(',').reverse()
        arr = Array(...new Set(arr))
        arr = arr.filter(e => e.trim()).splice(0, 10)
        this.historyList = arr
      } else {
        this.historyList = []
      }
    },
    search (k) {
      // console.log(k)
      if (k) {
        this.keyWord = k
      }
      if (!this.keyWord) {
        return false
      }
      searchTable({ keyWord: this.keyWord }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$refs.myInput.blur()
          this.searched = true
          if (res.data.tables) {
            this.list = res.data.tables.filter(e => !this.filterArr.includes(e.tableCode)) || []
          } else {
            this.list = []
          }
          let str = localStorage.getItem('knames')
          if (str === null || str === '') {
            str = this.keyWord
          } else {
            str = JSON.parse(str)
            str = str + ',' + this.keyWord
          }
          localStorage.setItem('knames', JSON.stringify(str))
          this.disponse()
        }
      })
    },
    onConfirm () {
      localStorage.removeItem('knames')
      this.disponse()
      this.popout = false
    },
    clear () {
      this.keyWord = ''
      this.searched = false
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  height: 100vh;
  background: #F4F4F4;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 10px 20px;
  .search-head{
    height: .89rem;
    display: flex;
    margin-bottom: .43rem;
    .bg{
      background: #FFFFFF;
      display: flex;
      border-radius: .46rem;
      width: 7.89rem;
      padding: .22rem;
      .left{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: .46rem;
          height: .46rem;
        }
      }
      .center{
        overflow: hidden;
        padding-left: 5px;
        padding-right: 5px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        form{
          width: 100%;
          height: 100%;
        }
        input{
          border: none;
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          -webkit-appearance: none;
        }
        input[type=search]::-webkit-search-cancel-button{
          -webkit-appearance: none;
        }
      }
      .right{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: .46rem;
          height: .46rem;
        }
      }
    }
    span{
      width: 1.62rem;
      text-align: right;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .everyone{
    padding-bottom: .27rem;
    .everyone-title{
      font-size: 14px;
      color: #333333;
      font-weight: 700;
      margin-bottom: .16rem;
    }
  }
  .same-style{
    .container{
      display: flex;
      flex-wrap: wrap;
      .block{
        padding: .11rem .27rem;
        margin-right: .16rem;
        margin-bottom: .27rem;
        background: #FFFFFF;
        border-radius: .35rem;
        height: .68rem;
        line-height: .68rem;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .history{
    .history-title{
      height: .54rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: .16rem;
      span:first-child{
        font-size: 14px;
        font-weight: 700;
        color: #333333;
      }
      span:last-child{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: .43rem;
          height: .43rem;
        }
      }
    }
  }
  .searched::-webkit-scrollbar {
    display: none;
  }
  .searched{
    overflow-y: scroll;
    padding-bottom: 1rem;
    height: 100%;
    .title{
      color: #333333;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: .27rem;
    }
    .card{
      padding: 0 .27rem 0rem;
      background: #FFFFFF;
      overflow: hidden;
      border-radius: .32rem;
      .card-block{
        display: flex;
        padding-bottom: .27rem;
        margin-top: .27rem;
        border-bottom: 1px solid #E5E5E5;
        overflow: hidden;
        .left{
          border-radius: .11rem;
          min-width: 1.84rem;
          max-width: 1.84rem;
          min-height: 1.84rem;
          max-height: 1.84rem;
          overflow: hidden;
          img{
            width: 1.84rem;
            height: 1.84rem;
          }
        }
        .right{
          padding-left: .27rem;
          position: relative;
          overflow: hidden;
          flex: 1;
          .name{
            color: #333333;
            font-weight: 700;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: .11rem;
          }
          .intr{
            color: #666666;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .price{
            position: absolute;
            width: 100%;
            bottom: 0;
            left: .27rem;
            display: flex;
            overflow: hidden;
            justify-content: space-between;
            .price-left{
              color: #333333;
              font-weight: 700;
              font-size: 14px;
              width: 2.7rem;
            }
            .price-right{
              color: #666666;
              font-size: 14px;
              overflow: hidden;
              flex: 1;
              text-align: right;
              padding-right: .27rem;
              img{
                width: .3rem;
                height: .38rem;
                margin-right: .14rem;
              }
            }
          }
        }
      }
      .card-block:last-child{
        border: none;
        margin-bottom: .27rem;
      }
    }
  }
  .none-list{
    height: 100%;
    padding-top: 4.38rem;
    text-align: center;
    img{
      width: 3.78rem;
      height: 3.78rem;
    }
    .text{
      color: #999999;
      font-size: 18px;
      text-align: center;
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
    .popout_box{
      margin-top: 30vh;
      width: 8.76rem;
      height: 6.57rem;
      border-radius: .54rem;
      background-color: #FFFFFF;
      .popout_body{
        height: 100%;
        position: relative;
        overflow: hidden;
        .text{
          text-align: center;
          color: #000000;
          font-weight: 700;
          font-size: 16px;
          margin-top: 1.7rem;
        }
        .btns{
          position: absolute;
          width: 100%;
          bottom: 24px;
          left: 0;
          padding-top: 14px;
          text-align: center;
          .cancel{
            color: #34B7B9;
            border-color: #34B7B9;
          }
          .van-button{
            width: 2.92rem;
            height: 1.08rem;
            margin: 0 .27rem;
            border-radius: .43rem;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
