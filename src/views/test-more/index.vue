<template>
  <div class="main">
    <van-loading color="#1989fa" v-if="loading" />
    <div class="header" v-else>
      <div class="search" @click="$router.push('/search')">
        <img src="@/assets/img/test/search.png" alt="search">
        <span>请输入您要找的量表名</span>
      </div>
      <div class="recommend-box">
        <span class="recommendTitle">小愈精选</span>
        <van-row gutter="8">
          <van-col span="8" v-for="item in recommendList" :key="item.tableCode">
            <div class="recommend-box-content" :title="item.tableType">
              <img :src="item.tableLogo" alt="推荐位" style="width: 100%"
                @click="$router.push({ path: '/test-detail', query: { tableCode: item.tableCode } })">
              <p class="recommend-title">{{ item.introduction }}</p>
            </div>
          </van-col>
        </van-row>
      </div>
      <!-- 轮播图 -->
      <van-swipe :autoplay="5000">
        <van-swipe-item>
          <img class="game" @click.stop="playGame" src="@/assets/img/test/game.png" alt="game">
        </van-swipe-item>
        <van-swipe-item v-for="(item, index) in swipList" :key="index">
          <img :src="item.imageLink" @click="toDeatil(item)" />
        </van-swipe-item>
      </van-swipe>
      <div class="testTitle">
        <img src="@/assets/img/test/deng.png" alt="deng">
        <span>小愈测试</span>
        <img src="@/assets/img/test/deng.png" alt="deng">
      </div>
      <div class="typeList">
        <div class="typeItem" :style="{ maxHeight: hide ? '0.8rem' : '300px' }">
          <div class="item" :class="{ selected: active === index }" v-for="(item, index) in typeList" :key="item.index"
            @click="selectHandle(item.id, index)">
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
    <NewPersonGift :flag="newPersonFlag" />
  </div>
</template>

<script>
import { tableTypeList, getAllTable, h5ActivitylList } from '@/api/modules/user'
import { recommendSeat } from '@/api/modules/table'
import MainTabbar from '@/components/MainTabbar'
import NewPersonGift from '@/components/newPerson'

export default {
  components: {
    MainTabbar,
    NewPersonGift
  },
  data () {
    return {
      hide: true,
      loading: false,
      active: 0,
      typeList: [],
      tableList: [],
      tableAll: [],
      swipList: [],
      newPersonFlag: false,
      recommendList: []
    }
  },
  mounted () {
    this.getTypeList()
    this.geth5ActivitylList()
    this.getRecommend()
    if (localStorage.getItem('phone')) {
      this.$store.dispatch('getInfo').then(res => {
        if (res.data.isNewUser && !res.data.isRxNUReward) {
          this.newPersonFlag = true
          // 这是满足新人有礼条件
        }
      })
    }
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
      getAllTable().then(table => {
        const typeAll = res.data.tables.filter(v => v.count !== 0)
        typeAll.forEach((v, i) => {
          const flag = table.data.some(item => {
            return v.id === item.selfTableType.id
          })
          if (!flag) {
            typeAll.splice(i, 1)
          }
        })
        this.typeList = typeAll
        this.tableAll = table.data
        const id = this.typeList[0].id
        this.tableList = this.tableAll.filter(v => v.selfTableType.id === id)
        this.loading = false
      })
    },
    geth5ActivitylList () {
      h5ActivitylList({ status: 2 }).then(res => {
        if (res.code === 0) {
          const activityBasicInfo = res.data.activityBasicInfo || []
          this.swipList = activityBasicInfo.filter(e => e.imageLink)
        }
        // console.log(this.swipList)
      })
    },
    toDeatil (item) {
      this.$router.push(`/test-detail?tableCode=${item.tables[0]}&discountCode=${item.discountCode}`)
    },
    showAll () {
      this.hide = !this.hide
    },
    selectHandle (id, index) {
      this.active = index
      this.tableList = this.tableAll.filter(v => v.selfTableType.id === id)
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
  padding: 10rem/@w 20rem/@w;
  overflow: hidden;

  .search {
    display: flex;
    align-items: center;
    width: 315rem/@w;
    height: 33rem/@w;
    background: #fff;
    border-radius: 17rem/@w;
    padding: 0 10rem/@w;

    img {
      width: 15rem/@w;
      height: 17rem/@w;
    }

    span {
      font-size: 14rem/@w;
      color: #999;
      margin-left: 10rem/@w;
    }
  }

  .van-swipe {
    margin: 10rem/@w 0 16rem/@w 0;
    width: 100%;

    .van-swipe-item {
      img {
        width: 100%;
        height: 100%;
      }
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

// 推荐位
.recommend-box {
  margin: .2667rem 0;
  padding: .32rem .2667rem;
  background-color: #fff;
  border-radius: .32rem;

  .recommendTitle {
    font: 500 .4267rem/.5867rem PingFang SC-Medium, PingFang SC;
    color: #242424;
  }

  .van-row {
    margin-top: .2133rem;

    .recommend-box-content {
      position: relative;

      // 推荐位分类标签
      &::after {
        content: attr(title);
        position: absolute;
        left: 0;
        top: 0;
        padding: 0 7px;
        min-width: 34px;
        height: 19px;
        line-height: 19px;
        text-align: center;
        color: #fff;
        border-radius: 5px 0px 5px 0px;
        transform: scale(.84) translate(-10%, -10%);
        background: rgba(0, 0, 0, .6);
      }

      img {
        border-radius: 4px;
      }
    }
  }
}

.recommend-title {
  margin: .1rem 0 0 0;
  font-size: 12px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
