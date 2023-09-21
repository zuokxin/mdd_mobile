<template>
  <div class="main">
    <van-loading color="#1989fa" v-if="loading" />
    <div class="header" v-else>
      <div class="recommend" @click="$router.push({ path: '/test-detail', query: { tableCode: 'FADI' } })">
        <img src="@/assets/img/test/fadi.png" alt="">
      </div>
      <div class="testTitle">
        <img src="@/assets/img/test/deng.png" alt="deng">
        <span>小愈测试</span>
        <img src="@/assets/img/test/deng.png" alt="deng">
      </div>
      <div class="typeList">
        <div class="typeItem" :style="{ maxHeight: hide ? '0.8rem' : '300px' }">
          <div :class="['item',{ 'selected': active === item.id }]" v-for="(item) in typeList" :key="item.index"
            @click="selectHandle(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="right" @click="showAll">
          <div class="show" :class="{ hideButton: hide }">
            <img v-if="hide" src="@/assets/img/test/hide.png" alt="hide">
            <img v-else src="@/assets/img/test/show.png" alt="show">
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="tableList">
        <div class="cardItem" v-for="(item) in tableList" :key="item.index"
          @click="$router.push({ path: '/test-detail', query: { tableCode: item.tableCode } })">
          <img :src="item.tableLogo" alt="">
          <div class="b_content">
            <div class="b_title">{{ item.tableName }}</div>
            <div class="b_title b_intros">{{ item.tableIntroduction }}</div>
            <div class="b_price">￥{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <MainTabbar></MainTabbar>
    </div>
  </div>
</template>

<script>
import { tableTypeList, getAllTable } from '@/api/modules/user'
import { recommendSeat } from '@/api/modules/table'
import MainTabbar from '@/components/MainTabbar'
// import browser from '@/utils/browser.js'
export default {
  components: {
    MainTabbar
  },
  data () {
    return {
      hide: true,
      loading: false,
      active: 0,
      typeList: [],
      tableList: [],
      tableAll: [],
      recommendList: [],
      tableCode: ''
    }
  },
  mounted () {
    console.log('this.$route', this.$route, 'this.tableCode', this.tableCode, this)
    this.getTypeList()
    this.getRecommend()
  },
  beforeRouteEnter (to, from, next) {
    // debugger
    if (from.path === '/test-detail') {
      next(vm => {
        vm.tableCode = from.query.tableCode
      })
    }
    next()
  },
  methods: {
    getRecommend () {
      recommendSeat().then(
        res => {
          this.recommendList = res.data
        }
      )
    },
    async getTypeList () {
      this.loading = true
      const res = await tableTypeList({ page: -1, pageSize: 10 })
      this.typeList = res.data.tables
      console.log('119this.typelist', this.typeList)
      getAllTable().then(table => {
        console.log('table', table)
        const typeAll = res.data.tables.filter(v => v.count !== 0)
        typeAll.forEach((v, i) => {
          const flag = table.data.some(item => {
            return v.id === item.selfTableType.id
          })
          if (!flag) {
            typeAll.splice(i, 1)
          }
        })
        console.log('typeall', typeAll, 'tableall', table.data)
        this.typeList = typeAll
        this.tableAll = table.data
        this.init()
        this.$nextTick(() => {
          const dom = document.getElementsByClassName('selected')[0]
          if (dom.offsetTop !== 0) {
            this.showAll()
          }
        })
        this.loading = false
      })
    },
    init () {
      let id = this.typeList[0].id
      if (this.tableCode) {
        this.tableAll.forEach(v => {
          if (v.tableCode === this.tableCode) {
            id = v.selfTableType.id
          }
        })
      }
      this.selectHandle(id)
    },
    toDeatil (item) {
      this.$router.push(`/test-detail?tableCode=${item.tables[0]}&discountCode=${item.discountCode}`)
    },
    showAll () {
      this.hide = !this.hide
    },
    selectHandle (id) {
      this.active = id
      this.tableList = this.tableAll.filter(v => v.selfTableType.id === id)
    },
    openCbt () {
      if (
        window.location.hostname.includes('127.0.0.1') ||
        window.location.hostname.includes('10.0.0')
      ) {
        window.location.href = 'https://depression.local.fubianmed.com/share/?type=Y2J0MDE='
      } else {
        window.location.href = window.location.origin + '/share/?type=Y2J0MDE='
      }
    },
    playGame () {
      const userId = localStorage.getItem('userId')
      window.location.href = `https://depression.fubianmed.com/game/xcwm${userId ? '?userId=' + userId : ''}`
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;

.main {
  height: 100vh;
  display: flex;
  flex-direction: column
}

.header {
  // width: 100%;
  min-height: 170rem/@w;
  background: #F4F4F4;
  padding: 16rem/@w 20rem/@w 10rem/@w;
  overflow: hidden;
  .recommend{
    height: 97rem/@w;
    margin-bottom: 6rem/@w;
    font-size: 0;
    img{
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .testTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25rem/@w;
    margin-bottom: 10rem/@w;

    img {
      width: 12rem/@w;
      height: 15rem/@w;
      margin-top: 4px;
    }

    span {
      color: #333333;
      font-size: 18rem/@w;
      font-weight: 600;
      margin: 0 7rem/@w;
    }
  }

  .typeList {
    display: flex;
    justify-content: space-between;
    min-height: 30rem/@w;

    .typeItem {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      transition: all 0.5s ease;

      .item {
        font-size: 14rem/@w;
        color: #666;
        height: 18rem/@w;
        padding: 4rem/@w 8rem/@w;
        white-space: nowrap;
      }

      .selected {
        background: rgba(52, 183, 185, 0.0500);
        border-radius: 13rem/@w;
        border: 1px solid #34B7B9;
        padding: 3rem/@w 7rem/@w;
      }
    }

    .right {
      width: 34rem/@w;
      height: auto;

      .show {
        width: 34rem/@w;
        height: 26rem/@w;
        background: #34B7B9;
        border-radius: 13rem/@w;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 14rem/@w;
          height: 14rem/@w;
        }
      }

      .hideButton {
        background: #fff;
      }
    }
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  background: #F4F4F4;
  padding: 2rem/@w 20rem/@w 10rem/@w 20rem/@w;

  .tableList {
    // width: 315rem/@w;
    background: #FFFFFF;
    border-radius: 12rem/@w;
    padding: 6rem/@w 10rem/@w;
    overflow-y: auto;

    .cardItem {
      display: flex;
      height: 68rem/@w;
      padding: 10rem/@w 0;
      border-bottom: 1px solid #E5E5E5;

      img {
        width: 68rem/@w;
        height: rem/@w;
      }

      .b_content {
        margin-left: 10rem/@w;

        .b_title {
          width: 235rem/@w;
          font-size: 14rem/@w;
          color: #333333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .b_intros {
          font-size: 12rem / @w;
          color: #666;
          margin-top: 5rem /@w;
        }

        .b_price {
          font-size: 14rem/@w;
          color: #F31313;
          margin-top: 7rem/@w;
        }
      }
    }

    .cardItem:last-child {
      border-bottom: 0;
    }
  }
}

.footer {
  height: 1.226667rem;
}

.van-loading {
  position: relative;
  color: #D5D5D5;
  font-size: 0;
  vertical-align: middle;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0);
}
</style>
