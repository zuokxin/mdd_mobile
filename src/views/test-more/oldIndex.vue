<template>
  <div class="main">
    <van-loading color="#1989fa" v-if="loading"/>
    <van-tree-select
      class="tree"
      ref="treeSelect"
      height="auto"
      :style="{'--beforeHeight': beforeHeight, '--afterHeight': afterHeight}"
      :items="items"
      :active-id.sync="items.activeId"
      :main-active-index.sync="items.activeId"
      @click-nav="onNavClick"
      v-else>
      <template slot="content">
        <div v-if="tableSelect.length > 0">
          <div class="m_box"
          v-for="item in tableSelect"
          :key="item.index"
          @click="$router.push({ path: '/test-detail', query:{ tableCode: item.tableCode } })">
            <img :src="item.tableLogo" alt="">
            <div class="b_content">
              <div class="b_title">{{item.tableName}}</div>
              <div class="b_title b_intros">{{item.tableIntroduction}}</div>
              <div class="b_price">￥{{item.price}}</div>
            </div>
          </div>
        </div>
        <div class="noTable" v-else>
          <img src="@/assets/img/my/noTable.png" alt="noTable">
          <span>暂无测试</span>
        </div>
      </template>
    </van-tree-select>
    <div class="footer"><MainTabbar></MainTabbar></div>
  </div>
</template>

<script>
import { tableTypeList, getAllTable } from '@/api/modules/user'
import MainTabbar from '@/components/MainTabbar'
export default {
  data () {
    return {
      items: [],
      tableAll: [],
      tableSelect: [],
      beforeHeight: '0.24rem',
      afterHeight: '0',
      loading: false
    }
  },
  components: {
    MainTabbar
  },
  mounted () {
    this.getTypeList()
  },
  methods: {
    async getTypeList () {
      this.loading = true
      const res = await tableTypeList({ page: -1, pageSize: 10 })
      getAllTable().then(table => {
        // const typeAll = res.data.tables.filter(v => v.name !== 'AI心理测评')
        const typeAll = res.data.tables.filter(v => v.count !== 0)
        typeAll.forEach((v, i) => {
          const flag = table.data.some(item => {
            return v.id === item.selfTableType.id
          })
          // console.log(flag, i, v.name)
          if (!flag) {
            typeAll.splice(i, 1)
          }
        })
        // console.log(typeAll)
        this.items = typeAll.map(v => {
          return {
            text: v.name,
            activeId: v.id
          }
        })
        this.getTableList()
      })
    },
    getTableList () {
      getAllTable().then(res => {
        if (res.code === 0) {
          this.tableAll = res.data.filter(v => {
            if (v.tableType === 2) {
              return v.tableCode === 'hama' || v.tableCode === 'hamd'
            } else {
              return v
            }
          })

          const id = this.items[0].activeId
          this.tableSelect = this.tableAll.filter(v => v.selfTableType.id === id)
          this.loading = false
        }
      })
    },
    onNavClick (index) {
      const id = this.items[index].activeId
      this.tableSelect = this.tableAll.filter(v => v.selfTableType.id === id)
      const doc = document.querySelectorAll('.van-sidebar-item')
      doc.forEach(v => {
        v.style.borderRadius = 0
      })
      if (index !== 0) {
        doc[index - 1].style.borderBottomRightRadius = '0.24rem'
        this.beforeHeight = '0'
      } else {
        this.beforeHeight = '0.24rem'
      }
      if (index !== doc.length - 1) {
        doc[index + 1].style.borderTopRightRadius = '0.24rem'
        this.afterHeight = '0'
      } else {
        this.afterHeight = '0.24rem'
      }
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
  height: 100vh;
  .tree{
    flex: 1;
    overflow: auto;
    .van-tree-select__nav{
      flex:none;
      width: 1.78rem;
      // background: #fff;
      // white-space: nowrap;
      .van-sidebar-item{
        background-color: #fff;
        padding: 0 .213333rem;
        text-align: center;
        font-size: .32rem;
        color: #999999;
        font-weight: 500;
        height: 40px;
        justify-content: center;
        display: flex;
        align-items: center;
      }
      // .van-sidebar-item:not(:last-child){
      //   // margin-bottom: 0.2rem;
      // }
      /deep/.van-sidebar-item__text{
        line-height: initial;
      }
      .van-sidebar-item--select{
        background-color: #F4F4F4;
        color: #34B7B9;
        font-weight: 600;
        height: 40px;
        // margin: 5px 0;
      }
      .van-sidebar-item--select::before{
        width: 4px;
        height: .88rem;
        background: #34B7B9;
        border-radius: 0px 4px 4px 0px;
      }
    }
    .van-tree-select__content{
      flex: 1;
      background: #F4F4F4;
      padding: 0 .266667rem;
      padding-bottom: .266667rem;
      .noTable{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        top: 30%;
        img{
          width: 3.733333rem;
          height: 3.733333rem;
        }
        span{
          font-size: .48rem;
          color: #999999;
        }
      }
      .m_box{
        width: 7.093333rem;
        height: 1.813333rem;
        background: #FFFFFF;
        border-radius: .266667rem;
        margin-top: .266667rem;
        padding: .266667rem;
        display: flex;
        margin-right: 0;
        img{
          width: 1.813333rem;
          height: 1.813333rem;
        }
        .b_content{
          margin-left: .32rem;
          .b_title{
            width: 4.906667rem;
            font-size: .373333rem;
            color: #333333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .b_intros{
            font-size: 12rem / @w;
            color: #666;
            margin-top: 5rem /@w;
          }
          .b_price{
            font-size: .32rem;
            color: #666666;
            margin-top: .266667rem;
          }
        }
      }
    }
    // .van-sidebar-item--select::selection{
    //   content: '';
    //   display:inline-block;
    //   width: 100%;
    //   height: 0.1rem;
    //   background-color: #fff;
    // }
    .van-tree-select__nav::before{
      content: "";
      display:block;
      width: 100%;
      height: 0.426667rem;
      border-radius: 0 0 var(--beforeHeight) 0;
      background-color: #fff;
    }
    .van-tree-select__nav::after{
      content: "";
      display:block;
      width: 100%;
      height: 0.426667rem;
      border-radius: 0 var(--afterHeight) 0 0;
      background-color: #fff;
    }
  }
  .footer{
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
    background: rgba(0,0,0,0);
}
}

</style>
