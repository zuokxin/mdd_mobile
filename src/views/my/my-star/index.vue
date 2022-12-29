<template>
  <div class="star">
    <van-nav-bar title="我的收藏" left-arrow @click-left="$router.back()"/>
    <div class="list" v-if="(list.length > 0)">
      <div class="blocks" v-for="(item, index) in list" :key="index">
        <div class="left">
          <img v-if="item.tableLogo" :src="item.tableLogo" alt="">
        </div>
        <div class="right">
          <div class="tableName">{{item.tableCnName}}({{item.tableEnName}})</div>
          <div class="tip">{{item.tableIntroduction}}</div>
          <div class="price">￥{{item.price}}</div>
        </div>
      </div>
    </div>
    <div class="none" v-else>
      <div class="box">
        <img src="@/assets/img/my/nodata.png" alt="">
        <p>暂无收藏</p>
      </div>
    </div>
  </div>
</template>
<!-- getIndividual -->
<script>
import { getCollect } from '@/api/modules/user'
export default {
  name: 'star',
  data () {
    return {
      type: 1,
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      getCollect().then(res => {
        if (res.code === 0) {
          this.list = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.star{
  background: #F6F6F7;
  height: 100vh;
  .list{
    padding: .2667rem;
    .blocks{
      width: 100%;
      height: 2.3467rem;
      background: #FFFFFF;
      border-radius: .2667rem;
      margin-bottom: .2667rem;
      padding: .2667rem;
      box-sizing: border-box;
      display: flex;
      .left{
        min-width: 1.8133rem;
        max-width: 1.8133rem;
        height: 1.8133rem;
        img{
          width: 100%;
        }
      }
      .right{
        padding-left: .2667rem;
        flex: 1;
        .tableName{
          height: .6667rem;
          line-height: .6667rem;
          width: 6.32rem;
          font-size: .3733rem;
          color: #333333 ;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tip{
          color: #666666;
          height: .5067rem;
          line-height: .4267rem;
          font-size: .32rem;
          margin:  .08rem 0;
        }
        .price{
          color: #666666;
          height: .5067rem;
          line-height: .4267rem;
          font-size: .32rem;
        }
      }
    }
  }
  .none{
    display: flex;
    padding-top: 5.8667rem;
    justify-content: center;
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
        margin: 0;
        width: 100%;
        text-align: center;
        bottom: 0;
        color: #999999;
        font-size: .48rem;
      }
    }
  }
}
</style>
